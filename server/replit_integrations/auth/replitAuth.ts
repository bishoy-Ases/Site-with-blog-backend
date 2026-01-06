import * as client from "openid-client";
import { Strategy as OIDCStrategy, type VerifyFunction } from "openid-client/passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { authStorage } from "./storage";

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtlMs = 7 * 24 * 60 * 60 * 1000; // 1 week
  // connect-pg-simple expects TTL in seconds
  const sessionTtlSeconds = Math.floor(sessionTtlMs / 1000);
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    // Avoid hard failures when the sessions table hasn't been created yet.
    // The created schema matches connect-pg-simple expectations.
    createTableIfMissing: true,
    ttl: sessionTtlSeconds,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // In local/dev we typically run over HTTP, so secure cookies would be dropped.
      // In production, keep cookies secure.
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: sessionTtlMs,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(claims: any) {
  await authStorage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  // Ensure req.secure is accurate behind proxies (CloudFront/ALB/etc).
  // Defaults to 1 proxy hop, but can be overridden in hosting envs.
  // Examples:
  // - TRUST_PROXY=1 (default)
  // - TRUST_PROXY=2
  // - TRUST_PROXY=true (trust all; only if you fully control upstream proxies)
  const trustProxyEnv = process.env.TRUST_PROXY;
  const trustProxy =
    trustProxyEnv === "true"
      ? true
      : trustProxyEnv
        ? Number.isFinite(Number.parseInt(trustProxyEnv, 10))
          ? Number.parseInt(trustProxyEnv, 10)
          : 1
        : 1;

  app.set("trust proxy", trustProxy);

  // Use memory store for sessions in development
  if (!process.env.DATABASE_URL) {
    app.use(session({
      secret: process.env.SESSION_SECRET || 'development-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false, // Allow HTTP in development
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      },
    }));
  } else {
    app.use(getSession());
  }

  app.use(passport.initialize());
  app.use(passport.session());

  // Only setup OIDC if we have the required environment variables
  let config: any = null;
  if (process.env.REPL_ID) {
    config = await getOidcConfig();
  }

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  // Local authentication strategy
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
      // Only allow bishoy@aseskahraba.com
      if (email !== 'bishoy@aseskahraba.com') {
        return done(null, false, { message: 'Access denied. Only authorized administrators can access this area.' });
      }

      // Check password - use environment variable or default
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const isValidPassword = password === adminPassword;

      if (!isValidPassword) {
        return done(null, false, { message: 'Invalid password' });
      }

      // Create a mock user object for local auth
      const user = {
        claims: {
          sub: 'local-admin',
          email: 'bishoy@aseskahraba.com',
          first_name: 'Bishoy',
          last_name: 'Ases',
          profile_image_url: null
        }
      };

      // Upsert the admin user
      await authStorage.upsertUser({
        id: 'local-admin',
        email: 'bishoy@aseskahraba.com',
        firstName: 'Bishoy',
        lastName: 'Ases',
        profileImageUrl: null,
      });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  // Keep track of registered strategies
  const registeredStrategies = new Set<string>();

  // Helper function to ensure strategy exists for a domain
  const ensureStrategy = (domain: string) => {
    if (!config) return; // Skip OIDC setup in development

    const strategyName = `replitauth:${domain}`;
    if (!registeredStrategies.has(strategyName)) {
      const strategy = new OIDCStrategy(
        {
          name: strategyName,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`,
        },
        verify
      );
      passport.use(strategy);
      registeredStrategies.add(strategyName);
    }
  };

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    if (!config) {
      return res.status(501).json({
        message: "OIDC login is not configured. Set REPL_ID (and related OIDC env vars) or use local admin login.",
      });
    }

    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    if (!config) {
      return res.status(501).json({
        message: "OIDC callback is not configured. Set REPL_ID (and related OIDC env vars).",
      });
    }

    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    // Always clear the local session.
    req.logout(() => {
      // If OIDC isn't configured (common in local/dev), just redirect home.
      if (!config) {
        return res.redirect("/");
      }

      return res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href,
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  // Check if user is authenticated
  if (!req.isAuthenticated() || !user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // For local auth (no expires_at), allow through
  if (!user.expires_at) {
    return next();
  }

  // For OAuth, check token expiration
  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
