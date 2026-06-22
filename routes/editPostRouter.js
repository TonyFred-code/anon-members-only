import { Router } from "express";
import { editPostGet } from "../controllers/editPostController.js";
import { requireAuth } from "../middleware/authGuards.js";

const editPostRouter = Router();

editPostRouter.get("/", requireAuth, editPostGet);

export { editPostRouter };
