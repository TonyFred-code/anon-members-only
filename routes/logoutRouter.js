import { Router } from "express";
import { logOutUser } from "../controllers/logoutController.js";

const logoutRouter = Router();

logoutRouter.post("/", logOutUser);

export { logoutRouter };
