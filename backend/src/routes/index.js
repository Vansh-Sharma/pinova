import { Router } from "express";
import authRouter from "./auth.routes.js";
import boardRouter from "./board.routes.js";
import pinRouter from "./pin.routes.js";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/pins", pinRouter);
apiRouter.use("/boards", boardRouter);

export default apiRouter;
