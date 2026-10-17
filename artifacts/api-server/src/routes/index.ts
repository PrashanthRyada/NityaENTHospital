import { Router, type IRouter } from "express";
import healthRouter from "./health";
import hospitalRouter from "./hospital";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(hospitalRouter);
router.use(storageRouter);

export default router;
