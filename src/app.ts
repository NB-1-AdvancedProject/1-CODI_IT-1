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
import userRouter from "./routers/userRouter";
import productRouter from "./routers/productRouter";
import cartRouter from "./routers/cartRouter";
import { dashboardRouter } from "./routers/dashboardRouter";
import uploadRouter from "./routers/uploadRouter";
import { reviewRouter } from "./routers/reviewRouter";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/inquiries", inquiryRouter);
app.use("/api/auth", authRouter);
app.use("/api/stores", storeRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/product", reviewRouter);
app.use("/api/cart", cartRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/s3", uploadRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);
// swagger
if (process.env.NODE_ENV !== "production") {
  const swaggerDocument = YAML.load("./swagger/swagger.yaml");
  app.use("/api-docs", SwaggerUi.serve, SwaggerUi.setup(swaggerDocument));
}
export default app;
