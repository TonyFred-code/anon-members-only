import { Router } from "express";
import {
  demoAdminHomeGet,
  demoMemberHomeGet,
} from "../controllers/demoUserController.js";

const demoUserRouter = new Router();

demoUserRouter.get("/member", demoMemberHomeGet);
demoUserRouter.get("/admin", demoAdminHomeGet);

export { demoUserRouter };
