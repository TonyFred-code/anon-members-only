import "./config/env.js";
import "./config/passport.js"; // Expose Passport LocalStrategy
import express from "express";
import session from "express-session";
import passport from "passport";
import connectPgSimple from "connect-pg-simple";
("connect-pg-simple");
import flash from "connect-flash";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { indexRouter } from "./routes/indexRouter.js";
import { loginRouter } from "./routes/loginRouter.js";
import { registerRouter } from "./routes/registerRouter.js";
import { profileRouter } from "./routes/profileRouter.js";
import { adminRegistrationRouter } from "./routes/adminRegistrationRouter.js";
import { editPostRouter } from "./routes/editPostRouter.js";
import { homeRouter } from "./routes/homeRouter.js";
import { createPostRouter } from "./routes/createPostRouter.js";
import { membershipRouter } from "./routes/membershipRouter.js";
import pool from "./db/pool.js";
import { logoutRouter } from "./routes/logoutRouter.js";
import { demoUserRouter } from "./routes/demoUserRouter.js";
import { serverErrorMiddleware } from "./middleware/errorMiddleware.js";
import {
  attachFlashMessages,
  attachUserLocals,
} from "./middleware/responseModifiers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());

app.use(express.static(join(__dirname, "public")));

app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// SESSION SETUP
const PGStore = connectPgSimple(session);

app.use(
  session({
    store: new PGStore({ pool, createTableIfMissing: true }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 DAY
      httpOnly: true,
    },
    saveUninitialized: false,
  })
);

// PASSPORT AUTHENTICATION
app.use(passport.initialize());
app.use(passport.session());

// Flash Messages
app.use(flash());
app.use(attachFlashMessages);

// Middleware to expose user locals to every view automatically
app.use(attachUserLocals);

app.use("/demo", demoUserRouter); // Demo accounts
app.use("/logout", logoutRouter); // Visiting this route logs out the user
app.use("/membership", membershipRouter); // Membership Page
app.use("/create-post", createPostRouter); // Create New Post Page
app.use("/home", homeRouter); // Home Page (Posts Feed)
app.use("/edit-post", editPostRouter); // Edit Post Page
app.use("/admin-registration", adminRegistrationRouter); // Admin Registration Page
app.use("/profile", profileRouter); // Profile page
app.use("/register", registerRouter); // Register Page
app.use("/login", loginRouter); // Log In Page
app.use("/", indexRouter); // Landing Page

// ERROR HANDLING MIDDLEWARE
app.use(serverErrorMiddleware);

const PORT = process.env.PORT || 3000;

app
  .listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
  })
  .on("error", (error) => {
    console.error("Server failed to start with error: ", error);
  });
