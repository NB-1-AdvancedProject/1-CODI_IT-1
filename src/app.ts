import YAML from "yamljs";
import SwaggerUi from "swagger-ui-express";
import express from "express";
import {
  defaultNotFoundHandler,
  globalErrorHandler,
} from "./controllers/errorController";
import authRouter from "./routers/authRouter";
import inquiryRouter from "./routers/inquiryRouter";

import { storeRouter } from "./routers/storeRouter";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/inquiries", inquiryRouter);
app.use("/api/auth", authRouter);
app.use("/api/stores", storeRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);
// swagger
if (process.env.NODE_ENV !== "production") {
  const swaggerDocument = YAML.load("./swagger/swagger.yaml");
  app.use("/api-docs", SwaggerUi.serve, SwaggerUi.setup(swaggerDocument));
}
export default app;
