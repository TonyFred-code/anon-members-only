import { Router } from "express";
import { loginPage } from "../controllers/loginController.js";
import passport from "passport";

const loginRouter = Router();

loginRouter.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
loginRouter.get("/", loginPage);

export { loginRouter };
