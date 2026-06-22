import { getDisplayName } from "../lib/postDisplayName.js";

function attachFlashErrors(req, res, next) {
  res.locals.errors = req.flash("error");
  next();
}

function attachUserLocals(req, res, next) {
  res.locals.user = req.user;
  res.locals.getDisplayName = getDisplayName;
  next();
}

export { attachFlashErrors, attachUserLocals };
