import { Router } from "express";
import { loginPage } from "../controllers/loginController.js";

const loginRouter = Router();

loginRouter.get("/", loginPage);

export { loginRouter };
