import { Router } from "express";

const logoutRouter = Router();

logoutRouter.get("/", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      next(error);
    }

    res.redirect("/");
  });
});

export { logoutRouter };
