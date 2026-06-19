import { hashPassword } from "../lib/passwordUtils.js";
import pool from "../db/pool.js";
import { ADJECTIVES, NOUNS } from "../constants/userNameList.js";
import { validationResult } from "express-validator";

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("register", {
      errors: errors.array(),
      ADJECTIVES,
      NOUNS,
      formData: req.body,
    });
  }
  next();
}

function buildUsernameIfMissing(req, res, next) {
  if (!req.body.username && req.body.adjectives && req.body.nouns) {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    req.body.username = `${req.body.adjectives}-${req.body.nouns}-${suffix}`;
  }
  next();
}

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
    const { rows } = await pool.query(
      "SELECT id FROM users WHERE email = $1;",
      [req.query.email]
    );

    res.json({ taken: rows.length > 0 });
  } catch (error) {
    next(error);
  }
}

async function checkUsernameUnique(req, res, next) {
  try {
    const { rows } = await pool.query(
      "SELECT id FROM users WHERE username = $1;",
      [req.query.username]
    );

    res.json({ taken: rows.length > 0 });
  } catch (error) {
    next(error);
  }
}

async function registerPost(req, res, next) {
  try {
    const hashedPassword = await hashPassword(req.body.password);
    const { rows } = await pool.query(
      `
      INSERT INTO users (email, password, username)
       VALUES ($1, $2, $3)
       RETURNING id, email, username, is_member, is_admin, is_demo;
      `,
      [req.body.email, hashedPassword, req.body.username]
    );

    const user = rows[0];

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

export {
  registerGet,
  registerPost,
  checkEmailUnique,
  checkUsernameUnique,
  handleValidationErrors,
  buildUsernameIfMissing,
};
