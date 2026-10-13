import { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import { config } from "../config/env.js";

// Initialize Supabase client for token validation
let supabaseClient: any = null;
function getSupabase() {
  if (!supabaseClient && config.supabaseUrl && (config.supabaseServiceRoleKey || config.supabaseAnonKey)) {
    supabaseClient = createClient(
      config.supabaseUrl,
      config.supabaseServiceRoleKey || config.supabaseAnonKey
    );
  }
  return supabaseClient;
}

export interface AuthenticatedUser {
  id: string;
  email?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  // Development/Test mock auth fallback
  if (config.allowMockAuth) {
    const mockUserId = req.headers["x-mock-user-id"] as string;
    if (mockUserId) {
      req.user = {
        id: mockUserId,
        email: (req.headers["x-mock-user-email"] as string) || `${mockUserId}@pace.local`,
      };
      return next();
    }
    if (authHeader?.startsWith("Bearer mock-token-")) {
      const id = authHeader.replace("Bearer mock-token-", "");
      req.user = {
        id,
        email: `${id}@pace.local`,
      };
      return next();
    }
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      error: "Unauthorized: Missing or malformed Authorization header. Expected 'Bearer <token>'.",
    });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Unauthorized: Access token missing" });
    return;
  }

  try {
    const supabase = getSupabase();
    if (!supabase) {
      // If Supabase credentials are missing and we are in dev/test, warn and deny
      res.status(500).json({ error: "Supabase authentication client is not configured on server" });
      return;
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      res.status(401).json({
        error: "Unauthorized: Invalid or expired token",
        message: error?.message,
      });
      return;
    }

    req.user = {
      id: data.user.id,
      email: data.user.email,
    };

    next();
  } catch (err: any) {
    console.error("[Auth Middleware Error]:", err?.message);
    res.status(401).json({ error: "Unauthorized: Token verification failed" });
  }
}
