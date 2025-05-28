import express from "express";
import zaloRoutes from "./zalo.js";

const router = express.Router();

router.use("/zalo", zaloRoutes);

export default router;
