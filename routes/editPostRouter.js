import { Router } from "express";
import { editPostGet } from "../controllers/editPostController.js";

const editPostRouter = Router();

editPostRouter.get("/", editPostGet);

export { editPostRouter };
