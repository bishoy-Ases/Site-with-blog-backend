import type { Express } from "express";
import passport from "passport";
import { authStorage } from "./storage";
import { isAuthenticated } from "./replitAuth";

// Register auth-specific routes
export function registerAuthRoutes(app: Express): void {
  console.log('Registering auth routes...');
  
  // Local login route
  app.post("/api/login/local", (req, res, next) => {
    console.log('Login attempt:', req.body.email);
    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: 'Authentication error' });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || 'Invalid credentials' });
      }

      // Log the user in
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Login error' });
        }
        return res.json({ success: true, message: 'Logged in successfully' });
      });
    })(req, res, next);
  });

  // Get current authenticated user
  app.get("/api/auth/user", async (req: any, res) => {
    console.log('Auth user endpoint called, authenticated:', req.isAuthenticated());
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated() || !req.user) {
        console.log('User not authenticated');
        return res.status(401).json({ message: "Not authenticated" });
      }

      console.log('User object:', req.user);
      const userId = req.user.claims?.sub;
      if (!userId) {
        console.log('No userId in claims');
        return res.status(401).json({ message: "Invalid user session" });
      }

      const user = await authStorage.getUser(userId);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Check if user is authorized (only allow bishoy@aseskahraba.com)
      const allowedEmails = ["bishoy@aseskahraba.com"];
      if (!allowedEmails.includes(user.email)) {
        return res.status(403).json({
          message: "Access denied. Only authorized administrators can access this area.",
          email: user.email
        });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Logout route
  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout error' });
      }
      res.json({ success: true, message: 'Logged out successfully' });
    });
  });
}
