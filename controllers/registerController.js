import { hashPassword } from "../lib/passwordUtils.js";
import pool from "../db/pool.js";
import { ADJECTIVES, NOUNS } from "../constants/userNameList.js";
import { checkEmailExists, createNewUser } from "../db/queries.js";
import { buildUsername } from "../lib/buildUsername.js";

function registerGet(req, res) {
  res.render("register", {
    ADJECTIVES,
    NOUNS,
    formData: {
      adjectives: "",
      nouns: "",
      email: "",
    },
  });
}

async function checkEmailUnique(req, res, next) {
  try {
    const taken = await checkEmailExists(req.query.email);
    return res.json({ taken });
  } catch (error) {
    next(error);
  }
}

async function registerPost(req, res, next) {
  const { email, password, adjectives, nouns } = req.body;
  const hashedPassword = await hashPassword(req.body.password);
  const maxAttempts = 5; // Seems reasonable and reduces odds of collision

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const username = buildUsername(adjectives, nouns);

    try {
      const user = await createNewUser(email, username, hashedPassword);

      return req.login(user, (err) => {
        if (err) return next(err);
        res.redirect("/home");
      });
    } catch (error) {
      if (error.code === "23505" && error.constraint === "users_username_key") {
        continue; // retry with a new suffix
      }
      if (error.code === "23505" && error.constraint === "users_email_key") {
        return res.status(400).json({
          errors: [{ path: "email", msg: "Email already in use." }],
        });
      }
      return next(error);
    }
  }

  return res.status(500).json({
    errors: [
      {
        path: "username",
        msg: "Could not generate a unique username. Please try again.",
      },
    ],
  });
}

export { registerGet, registerPost, checkEmailUnique };
