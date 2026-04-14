import dotenv from "dotenv";

dotenv.config();

const required = ["JWT_SECRET"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

if (process.env.NODE_ENV === "production" && !process.env.MONGODB_URI) {
  throw new Error("Missing required environment variable: MONGODB_URI");
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongodbUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  useMockApi: process.env.PINAI_USE_MOCK_API === "true",
};

export default env;
