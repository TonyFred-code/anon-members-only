import { Router } from "express";
import {
  checkEmailUnique,
  checkUsernameUnique,
  registerGet,
  registerPost,
} from "../controllers/registerController.js";
import { registerValidationRules } from "../validators/registerValidation.js";
import { handleValidationErrors } from "../middleware/validationHandlers.js";
import { buildUsernameIfMissing } from "../middleware/registerMiddleware.js";

const registerRouter = Router();

registerRouter.get("/check-email", checkEmailUnique);
registerRouter.get("/check-username", checkUsernameUnique);
registerRouter.post(
  "/",
  buildUsernameIfMissing,
  registerValidationRules,
  handleValidationErrors,
  registerPost
);
registerRouter.get("/", registerGet);

export { registerRouter };
