import { Request } from "express";
import { Token } from "./user";

declare global {
  namespace Express {
    interface Request {
      user?: Token;
    }
  }
}
