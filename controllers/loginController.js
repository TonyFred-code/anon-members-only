import passport from "passport";

function loginPage(req, res) {
  res.render("login");
}

function userLoginAuth(req, res, next) {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res
        .status(401)
        .json({ error: info.message || "Email or password is incorrect" });
    }

    req.logIn(user, (error) => {
      if (error) {
        return next(error);
      }

      return res.status(200).json({ success: true, redirectUrl: "/home" });
    });
  })(req, res, next);
}

export { loginPage, userLoginAuth };
