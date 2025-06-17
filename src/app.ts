import YAML from "yamljs";
import SwaggerUi from "swagger-ui-express";
import express from "express";
import {
  defaultNotFoundHandler,
  globalErrorHandler,
} from "./controllers/errorController";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/products");
app.use("/api/inquiries");

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);
// swagger
if (process.env.NODE_ENV !== "production") {
  const swaggerDocument = YAML.load("./swagger/swagger.yaml");
  app.use("/api-docs", SwaggerUi.serve, SwaggerUi.setup(swaggerDocument));
}
export default app;
