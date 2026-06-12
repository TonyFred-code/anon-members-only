import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import pool from "../db/pool.js";
import { validPassword } from "../lib/passwordUtils.js";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const { rows } = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );

        const user = rows[0];

        if (!user) return done(null, false);

        const isValid = await validPassword(password, user.password);

        if (isValid) return done(null, user);

        return done(null, false);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, email, username, is_member, is_admin, is_demo FROM users WHERE id = $1;",
      [id]
    );
    const user = rows[0];

    done(null, user);
  } catch (error) {
    done(error);
  }
});
