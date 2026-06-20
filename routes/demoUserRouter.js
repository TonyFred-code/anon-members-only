import { Router } from "express";
import {
  demoAdminHomeGet,
  demoMemberHomeGet,
} from "../controllers/demoUserController.js";
import { ensureUserLoggedOut } from "../controllers/logoutController.js";

const demoUserRouter = new Router();

demoUserRouter.get("/member", ensureUserLoggedOut, demoMemberHomeGet);
demoUserRouter.get("/admin", ensureUserLoggedOut, demoAdminHomeGet);
demoUserRouter.get("/", (req, res) => {
  res.redirect("/");
});

export { demoUserRouter };
