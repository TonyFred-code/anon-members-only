import { Router } from "express";
import { adminRegistrationGet } from "../controllers/adminRegistrationController.js";
import { requireMember } from "../middleware/authGuards.js";

const adminRegistrationRouter = Router();

adminRegistrationRouter.get("/", requireMember, adminRegistrationGet);

export { adminRegistrationRouter };
