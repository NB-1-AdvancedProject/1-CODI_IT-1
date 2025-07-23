import YAML from "yamljs";
import SwaggerUi from "swagger-ui-express";
import express from "express";
import cors from "cors";
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
import notificationRouter from "./routers/notificationRouter";
import { reviewRouter } from "./routers/reviewRouter";
import { metadataRouter } from "./routers/metadataRouter";
import orderRouter from "./routers/orderRouter";
import path from "path";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const rootDir = path.resolve();

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", version: "1.0.0" });
});
app.use("/uploads", express.static(path.join(rootDir, "uploads")));
app.use("/inquiries", inquiryRouter);
app.use("/auth", authRouter);
app.use("/stores", storeRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/product", reviewRouter);
app.use("/review", reviewRouter);
app.use("/cart", cartRouter);
app.use("/dashboard", dashboardRouter);
app.use("/s3", uploadRouter);
app.use("/notifications", notificationRouter);
app.use("/metadata", metadataRouter);
app.use("/orders", orderRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);
// swagger
if (process.env.NODE_ENV !== "production") {
  const swaggerDocument = YAML.load("./swagger/swagger.yaml");
  app.use("/api-docs", SwaggerUi.serve, SwaggerUi.setup(swaggerDocument));
}
export default app;
