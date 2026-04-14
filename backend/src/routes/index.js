import { Router } from "express";
import authRouter from "./auth.routes.js";
import boardRouter from "./board.routes.js";
import pinRouter from "./pin.routes.js";
import env from "../config/env.js";

const apiRouter = Router();

if (!env.useMockApi) {
  apiRouter.use("/auth", authRouter);
  apiRouter.use("/boards", boardRouter);
}

apiRouter.use("/pins", pinRouter);

export default apiRouter;
