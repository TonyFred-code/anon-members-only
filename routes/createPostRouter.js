import { Router } from "express";
import { createPostGet } from "../controllers/createPostController.js";
import { requireAuth } from "../middleware/authGuards.js";

const createPostRouter = Router();

createPostRouter.get("/", requireAuth, createPostGet);

export { createPostRouter };
