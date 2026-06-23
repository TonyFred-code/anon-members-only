import { body } from "express-validator";

const loginValidationRules = [
  body("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Please enter a valid email address"),
  body("password").trim().notEmpty().withMessage("Password is required"),
];

export { loginValidationRules };
