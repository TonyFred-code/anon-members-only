import { Router } from "express";
import { loginPage, userLoginAuth } from "../controllers/loginController.js";
import passport from "passport";
import { loginValidationRules } from "../validators/loginValidation.js";
import { handleValidationErrors } from "../middleware/validationHandlers.js";
import { redirectIfAuthenticated } from "../middleware/authGuards.js";

const loginRouter = Router();

loginRouter.post(
  "/",
  redirectIfAuthenticated,
  loginValidationRules,
  handleValidationErrors,
  userLoginAuth
);
loginRouter.get("/", redirectIfAuthenticated, loginPage);

export { loginRouter };
