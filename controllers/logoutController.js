function ensureUserLoggedOut(req, res, next) {
  if (req.isAuthenticated()) {
    req.logout((err) => {
      if (err) return next(err);
    });
  }

  next();
}

export { ensureUserLoggedOut };
