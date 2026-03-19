import { Router } from "express";
import authRoutes from "./auth.routes.js";
const router = Router();
router.use("/auth", authRoutes);
import codeRoutes    from "./code.routes.js";
import historyRoutes from "./history.routes.js";
router.use("/code",    codeRoutes);
router.use("/history", historyRoutes);
export default router;