import { body } from "express-validator";

const registerValidationRules = [
  body("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Please enter a valid email address"),
  body("adjectives")
    .trim()
    .notEmpty()
    .withMessage("Please select an adjective."),
  body("nouns").trim().notEmpty().withMessage("Please select a noun."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Enter a stronger password."),
];

export { registerValidationRules };
