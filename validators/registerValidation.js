import { body } from "express-validator";

const registerValidationRules = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email address"),
  body("adjectives").notEmpty().withMessage("Please select an adjective."),
  body("nouns").notEmpty().withMessage("Please select a noun."),
  body("password")
    .notEmpty()
    .trim()
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
