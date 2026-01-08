/**
 * JWT-based authentication for Lambda (stateless)
 * Replaces express-session + Passport for serverless environment
 */

import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
const JWT_EXPIRY = '7d'; // 7 day token expiry

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string | null;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
  authToken?: string;
}

/**
 * Generate JWT token for authenticated user
 */
export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

/**
 * Verify JWT token and extract user
 */
export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Middleware: Extract JWT from Authorization header and verify
 */
export function jwtMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token provided - continue (route can decide if auth is required)
    return next();
  }

  const token = authHeader.slice(7); // Remove 'Bearer ' prefix
  const user = verifyToken(token);

  if (!user) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  req.user = user;
  req.authToken = token;
  next();
}

/**
 * Middleware: Require authentication
 */
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
}

/**
 * Authenticate with email/password
 */
export async function authenticateLocal(
  email: string,
  password: string
): Promise<{ success: boolean; user?: AuthUser; token?: string; error?: string }> {
  // Only allow bishoy@aseskahraba.com
  if (email !== 'bishoy@aseskahraba.com') {
    return {
      success: false,
      error: 'Access denied. Only authorized administrators can access this area.',
    };
  }

  // Check password
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  if (password !== adminPassword) {
    return {
      success: false,
      error: 'Invalid password',
    };
  }

  const user: AuthUser = {
    id: 'local-admin',
    email: 'bishoy@aseskahraba.com',
    firstName: 'Bishoy',
    lastName: 'Ases',
  };

  const token = generateToken(user);

  return {
    success: true,
    user,
    token,
  };
}

export default {
  generateToken,
  verifyToken,
  jwtMiddleware,
  requireAuth,
  authenticateLocal,
};
