import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { initializeDB } from "./config/db";
import httpStatusCodes from "http-status-codes";
import path from "path";
import { limiter } from "./middlewares/limiter.middleware";
import { corsOptions } from "./middlewares/cors.middleware";
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.set("trust proxy", 1);
app.use(limiter);

// Database connection
initializeDB();

import globalErrorHandler from "./middlewares/error.middleware";
import { routes } from "./routes/routes";

app.get("/api/v1", (req, res) => res.send("Hello World!"));
app.use("/api/v1", routes);

// Error handling
app.use(globalErrorHandler);
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatusCodes.NOT_FOUND).json({
    success: false,
    message: "Not found",
    errorMessage: [
      {
        path: req.originalUrl,
        message: "Api Not found",
      },
    ],
  });

  next();
});

export default app;
