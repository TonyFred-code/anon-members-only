import { Router } from "express";
import {
  demoAdminHomeGet,
  demoMemberHomeGet,
  demoRegularHomeGet,
} from "../controllers/demoUserController.js";
import { enforceUserLoggedOut } from "../middleware/authGuards.js";

const demoUserRouter = new Router();

demoUserRouter.get("/member", enforceUserLoggedOut, demoMemberHomeGet);
demoUserRouter.get("/admin", enforceUserLoggedOut, demoAdminHomeGet);
demoUserRouter.get("/regular", enforceUserLoggedOut, demoRegularHomeGet);
demoUserRouter.get("/", (req, res) => {
  res.redirect("/");
});

export { demoUserRouter };
