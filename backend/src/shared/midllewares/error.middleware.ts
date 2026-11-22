import {
  type Request,
  type Response,
  type NextFunction,
} from "express";

import { AppError } from "../errors/app-error.js";


export function errorMiddleware(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {

  console.error(error);

  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
    });
    return;
  }

  res.status(500).json({
    message: "Erro interno do servidor.",
  });
}