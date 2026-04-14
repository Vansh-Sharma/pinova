import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import env from "./env.js";

let memoryServer = null;

export async function connectDatabase() {
  mongoose.set("strictQuery", true);

  if (env.mongodbUri) {
    await mongoose.connect(env.mongodbUri);
    return;
  }

  memoryServer = await MongoMemoryServer.create();
  const inMemoryUri = memoryServer.getUri();
  await mongoose.connect(inMemoryUri);
}

export async function disconnectDatabase() {
  await mongoose.connection.close();
  if (memoryServer) {
    await memoryServer.stop();
  }
}
