import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { indexRouter } from "./routes/indexRouter.js";
import { loginRouter } from "./routes/loginRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());

app.use(express.static(join(__dirname, "public")));

app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

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
