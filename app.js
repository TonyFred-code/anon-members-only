import express from "express";
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());

app.use(express.static(join(__dirname, "public")));

app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

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
app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const errMessage = err.message || "Internal server error";
  res.status(statusCode).send(`<h1> Error: ${errMessage}`);
});

const PORT = process.env.PORT || 3000;

app
  .listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
  })
  .on("error", (error) => {
    console.error("Server failed to start with error: ", error);
  });
