import { hashPassword } from "../lib/passwordUtils.js";
import pool from "../db/pool.js";
import { ADJECTIVES, NOUNS } from "../constants/userNameList.js";
import {
  checkEmailExists,
  checkUsernameExists,
  createNewUser,
} from "../db/queries.js";

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

async function checkUsernameUnique(req, res, next) {
  try {
    const taken = await checkUsernameExists(req.query.username);
    return res.json({ taken });
  } catch (error) {
    next(error);
  }
}

async function registerPost(req, res, next) {
  try {
    const hashedPassword = await hashPassword(req.body.password);
    const user = await createNewUser(
      req.body.email,
      req.body.username,
      hashedPassword
    );

    req.login(user, (err) => {
      if (err) return next(err);
      res.redirect("/home");
    });
  } catch (error) {
    if (error.code === "23505") {
      if (error.constraint === "users_email_key") {
        return res.status(400).json({
          errors: [{ path: "email", msg: "Email already in use." }],
        });
      }
      if (error.constraint === "users_username_key") {
        return res.status(400).json({
          errors: [
            {
              path: "username",
              msg: "Username already taken, please try again.",
            },
          ],
        });
      }
      return res.status(400).json({
        errors: [
          { path: "network", msg: "Registration failed. Please try again." },
        ],
      });
    }

    next(error);
  }
}

export { registerGet, registerPost, checkEmailUnique, checkUsernameUnique };
