import { Router } from "express";
import { registerGet } from "../controllers/registerController.js";

const registerRouter = Router();

registerRouter.get("/", registerGet);

export { registerRouter };
