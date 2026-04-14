import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import env from "./config/env.js";

async function bootstrap() {
  try {
    await connectDatabase();
    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`PinAI API running on port ${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to start PinAI API", error);
    process.exit(1);
  }
}

bootstrap();
