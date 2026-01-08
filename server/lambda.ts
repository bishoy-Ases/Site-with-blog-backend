/**
 * AWS Lambda handler for API Gateway v2
 * Converts API Gateway events to Express request/response format
 */

import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { createServer } from "http";
import express from "express";
import { registerRoutes } from "./routes";
import { log } from "./index";

// Create Express app instance
const app = express();

// Middleware
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });

  next();
});

// Global variable to track if routes are registered
let routesRegistered = false;

/**
 * Lambda handler - converts API Gateway event to Express
 */
export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  try {
    // Register routes once on cold start
    if (!routesRegistered) {
      const httpServer = createServer(app);
      await registerRoutes(httpServer, app);

      // Error handler
      app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        res.status(status).json({ message });
        console.error(err);
      });

      routesRegistered = true;
      log("Routes registered");
    }

    // Convert API Gateway event to Express request format
    const method = event.requestContext.http.method;
    const path = event.requestContext.http.path;
    const headers = event.headers || {};
    const body = event.body ? (event.isBase64Encoded ? Buffer.from(event.body, "base64").toString() : event.body) : undefined;

    log(`Incoming: ${method} ${path}`);

    // Create mock request/response objects
    const req = {
      method,
      path,
      url: path + (event.rawQueryString ? `?${event.rawQueryString}` : ""),
      headers,
      body,
    };

    // Handle the request via Express
    return new Promise((resolve) => {
      const mockRes = {
        statusCode: 200,
        headers: {} as Record<string, string>,
        body: "",
        json: function (data: any) {
          this.headers["Content-Type"] = "application/json";
          this.body = JSON.stringify(data);
          resolve({
            statusCode: this.statusCode,
            headers: this.headers,
            body: this.body,
          });
          return this;
        },
        status: function (code: number) {
          this.statusCode = code;
          return this;
        },
        send: function (data: any) {
          if (typeof data === "string") {
            this.body = data;
          } else {
            this.headers["Content-Type"] = "application/json";
            this.body = JSON.stringify(data);
          }
          resolve({
            statusCode: this.statusCode,
            headers: this.headers,
            body: this.body,
          });
          return this;
        },
      };

      // Simple router to delegate to Express
      const testReq = { ...req } as any;
      const testRes = { ...mockRes } as any;

      // Delegate to Express
      app(testReq, testRes);

      // Fallback timeout
      setTimeout(() => {
        resolve({
          statusCode: 504,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Lambda timeout" }),
        });
      }, 25000); // Lambda timeout before 30s hard limit
    });
  } catch (error: any) {
    console.error("Lambda handler error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message || "Internal Server Error" }),
    };
  }
};

export default handler;
