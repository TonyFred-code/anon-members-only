import { Router } from "express";
import { loginPage, userLoginAuth } from "../controllers/loginController.js";
import passport from "passport";
import { loginValidationRules } from "../validators/loginValidation.js";
import { handleValidationErrors } from "../middleware/validationHandlers.js";

const loginRouter = Router();

loginRouter.post(
  "/",
  loginValidationRules,
  handleValidationErrors,
  userLoginAuth
);
loginRouter.get("/", loginPage);

export { loginRouter };
