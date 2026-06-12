import { Router } from "express";
import { createPostGet } from "../controllers/createPostController.js";

const createPostRouter = Router();

createPostRouter.get("/", createPostGet);

export { createPostRouter };
