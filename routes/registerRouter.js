import { Router } from "express";
import {
  checkEmailUnique,
  registerGet,
  registerPost,
} from "../controllers/registerController.js";
import { registerValidationRules } from "../validators/registerValidation.js";
import { handleValidationErrors } from "../middleware/validationHandlers.js";

const registerRouter = Router();

registerRouter.get("/check-email", checkEmailUnique);
registerRouter.post(
  "/",
  registerValidationRules,
  handleValidationErrors,
  registerPost
);
registerRouter.get("/", registerGet);

export { registerRouter };
