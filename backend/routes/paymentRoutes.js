import express from "express";
import { createPreference, webhook } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create_preference", createPreference);
router.post("/webhook", webhook);

export default router;
