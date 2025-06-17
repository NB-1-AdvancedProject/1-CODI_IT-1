import { Request } from "express";

export interface AuthenticatedUser {
  id: string;
}

export interface AuthenticatedUserRequest extends Request {
  user: AuthenticatedUser;
}

declare global {
  namespace Express {
    interface Request {
      user: AuthenticatedUser;
    }
  }
}
