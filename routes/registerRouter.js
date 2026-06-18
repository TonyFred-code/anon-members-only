import { Router } from "express";
import {
  buildUsernameIfMissing,
  checkEmailUnique,
  checkUsernameUnique,
  handleValidationErrors,
  registerGet,
  registerPost,
} from "../controllers/registerController.js";
import { registerValidationRules } from "../validators/registerValidation.js";

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
