import { Router } from "express";
import {
  demoAdminHomeGet,
  demoMemberHomeGet,
} from "../controllers/demoUserController.js";
import { ensureUserLoggedOut } from "../controllers/logoutController.js";

const demoUserRouter = new Router();

demoUserRouter.get("/member", ensureUserLoggedOut, demoMemberHomeGet);
demoUserRouter.get("/admin", ensureUserLoggedOut, demoAdminHomeGet);

export { demoUserRouter };
