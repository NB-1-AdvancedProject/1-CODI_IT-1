import "./lib/logger";
import "./lib/tracing";
import app from "./app";
import { connectRedis } from "./lib/redis";

(async () => {
  try {
    await connectRedis();
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  } catch (error) {
    console.error("Failed to connect Redis:", error);
    process.exit(1);
  }
})();
