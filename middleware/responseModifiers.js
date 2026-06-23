import { getPostAuthorDisplayName } from "../lib/postUtils.js";
import { getDisplayNameFromUsername } from "../lib/usernameUtils.js";

function attachFlashMessages(req, res, next) {
  res.locals.infos = req.flash("info");
  res.locals.errors = req.flash("error");
  res.locals.successes = req.flash("success");
  next();
}

function attachUserLocals(req, res, next) {
  res.locals.user = req.user;
  res.locals.getPostAuthorDisplayName = getPostAuthorDisplayName;
  res.locals.getDisplayNameFromUsername = getDisplayNameFromUsername;
  next();
}

export { attachFlashMessages, attachUserLocals };
