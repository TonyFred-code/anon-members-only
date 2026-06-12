import { Router } from "express";
import { homeGet } from "../controllers/homeController.js";

const homeRouter = Router();

homeRouter.get("/", homeGet);

export { homeRouter };
