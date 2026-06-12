import { Router } from "express";
import { profileGet } from "../controllers/profileController.js";

const profileRouter = Router();

profileRouter.get("/", profileGet);

export { profileRouter };
