import type { Request, Response, NextFunction } from "express";
import { adminAuth } from "./firebaseAdmin";

declare global {
  namespace Express {
    interface Request {
      uid?: string;
      email?: string;
      displayName?: string;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or malformed token" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    req.uid = decoded.uid;
    req.email = decoded.email;
    req.displayName = decoded.name;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
