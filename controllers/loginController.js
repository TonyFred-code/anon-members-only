import passport from "passport";

function loginPage(req, res) {
  res.render("login");
}

function userLoginAuth(req, res, next) {
  const missingFields = [];
  if (!req.body.email)
    missingFields.push({ path: "email", msg: "Email is required" });
  if (!req.body.password)
    missingFields.push({ path: "password", msg: "Password is required" });

  if (missingFields.length > 0) {
    return res.status(400).json({ errors: missingFields });
  }

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
