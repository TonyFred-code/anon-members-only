import passport from "passport";

function loginPage(req, res) {
  res.render("login");
}

function userLoginAuth(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        errors: [
          {
            path: "network",
            msg: info.message || "Email or password is incorrect",
          },
        ],
      });
    }

    // Keeping session info allows req.session.redirectTo to be defined
    req.logIn(user, { keepSessionInfo: true }, (error) => {
      if (error) {
        return next(error);
      }

      const targetUrl = req.session.redirectTo || "/home";

      delete req.session.redirectTo;

      return res.status(200).json({ success: true, redirectUrl: targetUrl });
    });
  })(req, res, next);
}

export { loginPage, userLoginAuth };
