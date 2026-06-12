import { Router } from "express";
import { landingPage } from "../controllers/indexController.js";

const indexRouter = Router();

indexRouter.get("/", landingPage);

export { indexRouter };
