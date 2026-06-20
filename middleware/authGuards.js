function enforceUserLoggedOut(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }

  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((destroyErr) => {
      if (destroyErr) return next(error);
      res.clearCookie("connect.sid");
      next();
    });
  });
}

export { enforceUserLoggedOut };
