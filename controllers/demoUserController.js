import { getDemoAdmin, getDemoMember, getDemoRegular } from "../db/queries.js";

async function demoRegularHomeGet(req, res, next) {
  try {
    const demoUser = await getDemoRegular();

    if (!demoUser) {
      req.flash("error", "Demo Regular Account not setup!");
      return res.redirect("/");
    }

    req.login(demoUser, (err) => {
      if (err) return next(err);
      res.redirect("/home");
    });
  } catch (error) {
    next(error);
  }
}

async function demoMemberHomeGet(req, res, next) {
  try {
    const demoUser = await getDemoMember();

    if (!demoUser) {
      req.flash("error", "Demo Member Account not setup!");
      return res.redirect("/");
    }

    req.login(demoUser, (err) => {
      if (err) return next(err);
      res.redirect("/home");
    });
  } catch (error) {
    next(error);
  }
}

async function demoAdminHomeGet(req, res, next) {
  try {
    const demoUser = await getDemoAdmin();

    if (!demoUser) {
      req.flash("error", "Demo Admin account not setup yet!");
      return res.redirect("/");
    }

    req.login(demoUser, (err) => {
      if (err) return next(err);
      res.redirect("/home");
    });
  } catch (error) {
    next(error);
  }
}

export { demoMemberHomeGet, demoAdminHomeGet, demoRegularHomeGet };
