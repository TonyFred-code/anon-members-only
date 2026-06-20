import { Router } from "express";
import {
  demoAdminHomeGet,
  demoMemberHomeGet,
} from "../controllers/demoUserController.js";
import { enforceUserLoggedOut } from "../middleware/authGuards.js";

const demoUserRouter = new Router();

demoUserRouter.get("/member", enforceUserLoggedOut, demoMemberHomeGet);
demoUserRouter.get("/admin", enforceUserLoggedOut, demoAdminHomeGet);
demoUserRouter.get("/", (req, res) => {
  res.redirect("/");
});

export { demoUserRouter };
