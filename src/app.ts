import express, { Application, Request, Response } from "express";
import cors from "cors";

import HttpStatus from "http-status";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import router from "./app/routes";
import cookieParser from "cookie-parser";
const app: Application = express();
app.use(
  cors({
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Portfolio server is running ....",
  });
});

app.use("/api", router);

app.use((req: Request, res: Response) => {
  res.status(HttpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND",
    error: {
      path: req.originalUrl,
      message: "API NOT FOUND",
    },
  });
});

app.use(globalErrorHandler);

export default app;
