import { Router } from "express";
import { adminRegistrationGet } from "../controllers/adminRegistrationController.js";
import { requireAuth, requireMember } from "../middleware/authGuards.js";

const adminRegistrationRouter = Router();

adminRegistrationRouter.get(
  "/",
  requireAuth,
  requireMember,
  adminRegistrationGet
);

export { adminRegistrationRouter };
