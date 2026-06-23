function enforceUserLoggedOut(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }

  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((destroyErr) => {
      if (destroyErr) return next(destroyErr);
      res.clearCookie("connect.sid");
      next();
    });
  });
}

function requireAuth(req, res, next) {
  if (!req.user) {
    req.session.redirectTo = req.originalUrl; // Allows intended destination redirect

    req.flash("error", "You need to register or log in to proceed");
    return res.redirect("/login");
  }
  next();
}

function requireMember(req, res, next) {
  if (!req.user?.is_member) {
    req.flash("error", "You need to be a clubhouse member to proceed");
    return res.redirect("/profile");
  }

  next();
}

export { enforceUserLoggedOut, requireAuth, requireMember };
