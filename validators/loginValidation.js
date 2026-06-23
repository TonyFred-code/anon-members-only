import { body } from "express-validator";

const loginValidationRules = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email address"),
  body("password").trim().notEmpty().withMessage("Password is required"),
];

export { loginValidationRules };
