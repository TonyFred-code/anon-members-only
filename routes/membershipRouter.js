import { Router } from "express";
import { membershipGet } from "../controllers/membershipController.js";
import { requireAuth } from "../middleware/authGuards.js";

const membershipRouter = Router();

membershipRouter.get("/", requireAuth, membershipGet);

export { membershipRouter };
