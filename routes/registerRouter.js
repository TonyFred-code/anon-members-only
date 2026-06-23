import { Router } from "express";
import {
  checkEmailUnique,
  registerGet,
  registerPost,
} from "../controllers/registerController.js";
import { registerValidationRules } from "../validators/registerValidation.js";
import { handleValidationErrors } from "../middleware/validationHandlers.js";
import { redirectIfAuthenticated } from "../middleware/authGuards.js";

const registerRouter = Router();

registerRouter.get("/check-email", checkEmailUnique);
registerRouter.post(
  "/",
  redirectIfAuthenticated,
  registerValidationRules,
  handleValidationErrors,
  registerPost
);
registerRouter.get("/", redirectIfAuthenticated, registerGet);

export { registerRouter };
