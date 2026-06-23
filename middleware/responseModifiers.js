import { getDisplayName } from "../lib/postDisplayName.js";

function attachFlashMessages(req, res, next) {
  res.locals.infos = req.flash("info");
  res.locals.errors = req.flash("error");
  res.locals.successes = req.flash("success");
  next();
}

function attachUserLocals(req, res, next) {
  res.locals.user = req.user;
  res.locals.getDisplayName = getDisplayName;
  next();
}

export { attachFlashMessages, attachUserLocals };
