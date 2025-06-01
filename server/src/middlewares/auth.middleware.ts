import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { off } from "process";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  // Check if the request has an authorization header
  //   console.log(req);
  const authHeader = req.headers.authorization;
  const { offline } = req.query;

  if (offline === "true") {
    // If offline mode is enabled, skip authentication
    return next();
  }

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header is missing" });
  }

  // Extract the token from the header
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token is missing" });
  }

  // Verify the token (this is a placeholder, implement your own verification logic)
  try {
    // Here you would typically verify the token using a library like jsonwebtoken
    const secret = process.env.JWT_SECRET || "shortner-secret-key";

    const decoded = jwt.verify(token, `${secret}`);

    req.user = decoded; // Attach user info to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(403).json({ error: "Invalid token" });
  }
};
