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
import notificationRouter from "./routers/notificationRouter";
import { reviewRouter } from "./routers/reviewRouter";
import { metadataRouter } from "./routers/metadataRouter";
import orderRouter from "./routers/orderRouter";
import cors from "cors";

const app = express();
app.use(express.json());
const allowedOrigins = [
  "http://localhost:3000",
  "http://54.180.24.230",
  "https://codeitsprintcodiit.duckdns.org/",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/inquiries", inquiryRouter);
app.use("/api/auth", authRouter);
app.use("/api/stores", storeRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/product", reviewRouter);
app.use("/api/review", reviewRouter);
app.use("/api/cart", cartRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/s3", uploadRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/metadata", metadataRouter);
app.use("/api/order", orderRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);
// swagger
if (process.env.NODE_ENV !== "production") {
  const swaggerDocument = YAML.load("./swagger/swagger.yaml");
  app.use("/api-docs", SwaggerUi.serve, SwaggerUi.setup(swaggerDocument));
}
export default app;
