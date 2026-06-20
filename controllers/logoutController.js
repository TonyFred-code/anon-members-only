function logOutUser(req, res, next) {
  req.logout((error) => {
    if (error) {
      next(error);
    }

    req.session.destroy((destroyErr) => {
      if (destroyErr) return next(error);
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  });
}

export { logOutUser };
