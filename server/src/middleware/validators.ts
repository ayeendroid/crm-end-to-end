import { body, param, query, ValidationChain } from "express-validator";

// Customer Validation
export const validateCustomer = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("phone")
    .optional()
    .trim()
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
    )
    .withMessage("Please provide a valid phone number"),

  body("company").optional().trim().isLength({ max: 100 }),

  body("status")
    .optional()
    .isIn(["active", "inactive", "prospect"])
    .withMessage("Invalid status value"),

  body("source")
    .optional()
    .isIn(["website", "referral", "social", "email", "phone", "event", "other"])
    .withMessage("Invalid source value"),
];

// Customer Update Validation (all fields optional)
export const validateCustomerUpdate = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),

  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("phone")
    .optional()
    .trim()
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
    )
    .withMessage("Please provide a valid phone number"),

  body("status")
    .optional()
    .isIn(["active", "inactive", "prospect"])
    .withMessage("Invalid status value"),
];

// Lead Validation
export const validateLead = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 }),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("phone")
    .optional()
    .trim()
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
    ),

  body("status")
    .optional()
    .isIn(["new", "contacted", "qualified", "converted", "lost"])
    .withMessage("Invalid status value"),

  body("source")
    .optional()
    .isIn([
      "website",
      "referral",
      "social",
      "email",
      "phone",
      "event",
      "other",
    ]),
];

// Deal Validation
export const validateDeal = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Deal title is required")
    .isLength({ min: 3, max: 200 }),

  body("value")
    .notEmpty()
    .withMessage("Deal value is required")
    .isFloat({ min: 0 })
    .withMessage("Deal value must be a positive number"),

  body("stage")
    .optional()
    .isIn([
      "lead",
      "qualified",
      "proposal",
      "negotiation",
      "closed-won",
      "closed-lost",
    ])
    .withMessage("Invalid deal stage"),

  body("probability")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Probability must be between 0 and 100"),

  body("expectedCloseDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),
];

// Activity Validation
export const validateActivity = [
  body("type")
    .notEmpty()
    .withMessage("Activity type is required")
    .isIn(["call", "email", "meeting", "note", "task", "deal", "other"])
    .withMessage("Invalid activity type"),

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Activity title is required")
    .isLength({ min: 3, max: 200 }),

  body("description").optional().trim().isLength({ max: 1000 }),

  body("date").optional().isISO8601().withMessage("Invalid date format"),
];

// User Registration Validation
export const validateRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 }),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  body("role")
    .optional()
    .isIn(["admin", "manager", "sales", "support"])
    .withMessage("Invalid role"),
];

// Login Validation
export const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
];

// MongoDB ObjectId Validation
export const validateObjectId = [
  param("id").isMongoId().withMessage("Invalid ID format"),
];

// Pagination Validation
export const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];
