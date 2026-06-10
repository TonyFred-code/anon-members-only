import { Router } from "express";
import { adminRegistrationGet } from "../controllers/adminRegistrationController.js";

const adminRegistrationRouter = Router();

adminRegistrationRouter.get("/", adminRegistrationGet);

export { adminRegistrationRouter };
