import { Router } from "express";
import { loginPage, userLoginAuth } from "../controllers/loginController.js";
import passport from "passport";

const loginRouter = Router();

loginRouter.post("/", userLoginAuth);
loginRouter.get("/", loginPage);

export { loginRouter };
