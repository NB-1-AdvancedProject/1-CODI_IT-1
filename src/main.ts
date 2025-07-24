import app from "./app";
import { connectRedis } from "./lib/redis";

(async () => {
  try {
    await connectRedis();
    app.listen(3002, () => {
      console.log(`Server is running on port ${process.env.PORT || 3001}`);
    });
  } catch (error) {
    console.error("Failed to connect Redis:", error);
    process.exit(1);
  }
})();
