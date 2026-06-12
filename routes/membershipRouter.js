import { Router } from "express";
import { membershipGet } from "../controllers/membershipController.js";

const membershipRouter = Router();

membershipRouter.get("/", membershipGet);

export { membershipRouter };
