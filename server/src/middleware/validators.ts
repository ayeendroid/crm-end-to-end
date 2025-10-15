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
    .optional({ checkFalsy: true })
    .trim()
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
    )
    .withMessage("Please provide a valid phone number"),

  body("company").optional({ checkFalsy: true }).trim().isLength({ max: 100 }),

  body("status")
    .optional({ checkFalsy: true })
    .isIn(["active", "inactive", "prospect"])
    .withMessage("Invalid status value"),

  body("source")
    .optional({ checkFalsy: true })
    .isIn(["website", "referral", "social", "email", "phone", "event", "other"])
    .withMessage("Invalid source value"),
];

// Customer Update Validation (all fields optional)
export const validateCustomerUpdate = [
  body("firstName")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),

  body("lastName")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),

  body("email")
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("phone")
    .optional({ checkFalsy: true })
    .trim()
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
    )
    .withMessage("Please provide a valid phone number"),

  body("status")
    .optional({ checkFalsy: true })
    .isIn(["active", "inactive", "prospect"])
    .withMessage("Invalid status value"),
];

// Lead Validation
export const validateLead = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 100 }),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 100 }),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("phone")
    .optional({ checkFalsy: true })
    .trim()
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
    )
    .withMessage("Please provide a valid phone number"),

  body("company").optional({ checkFalsy: true }).trim().isLength({ max: 100 }),

  body("status")
    .optional({ checkFalsy: true })
    .isIn([
      "new",
      "contacted",
      "qualified",
      "proposal",
      "negotiation",
      "closed-won",
      "closed-lost",
    ])
    .withMessage("Invalid status value"),

  body("source")
    .optional({ checkFalsy: true })
    .isIn([
      "website",
      "referral",
      "social",
      "email",
      "phone",
      "event",
      "advertisement",
      "other",
    ])
    .withMessage("Invalid source value"),

  body("assignedTo")
    .notEmpty()
    .withMessage("Assigned user is required")
    .isMongoId()
    .withMessage("Invalid user ID"),

  body("estimatedValue")
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("Estimated value must be a positive number"),

  body("notes").optional({ checkFalsy: true }).trim().isLength({ max: 2000 }),
];

// Deal Validation (for CREATE)
export const validateDeal = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Deal title is required")
    .isLength({ min: 3, max: 200 }),

  body("customer")
    .notEmpty()
    .withMessage("Customer is required")
    .isMongoId()
    .withMessage("Invalid customer ID"),

  body("value")
    .notEmpty()
    .withMessage("Deal value is required")
    .isFloat({ min: 0 })
    .withMessage("Deal value must be a positive number"),

  body("stage")
    .optional({ checkFalsy: true })
    .isIn([
      "prospecting",
      "qualification",
      "proposal",
      "negotiation",
      "closed-won",
      "closed-lost",
    ])
    .withMessage("Invalid deal stage"),

  body("probability")
    .optional({ checkFalsy: true })
    .isInt({ min: 0, max: 100 })
    .withMessage("Probability must be between 0 and 100"),

  body("expectedCloseDate")
    .notEmpty()
    .withMessage("Expected close date is required")
    .isISO8601()
    .withMessage("Invalid date format"),

  body("assignedTo")
    .notEmpty()
    .withMessage("Assigned user is required")
    .isMongoId()
    .withMessage("Invalid user ID"),

  body("description")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 }),

  body("notes").optional({ checkFalsy: true }).trim().isLength({ max: 2000 }),
];

// Deal Update Validation (all fields optional except when provided)
export const validateDealUpdate = [
  body("title")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Deal title must be between 3 and 200 characters"),

  body("customer")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage("Invalid customer ID"),

  body("value")
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("Deal value must be a positive number"),

  body("stage")
    .optional({ checkFalsy: true })
    .isIn([
      "prospecting",
      "qualification",
      "proposal",
      "negotiation",
      "closed-won",
      "closed-lost",
    ])
    .withMessage("Invalid deal stage"),

  body("probability")
    .optional({ checkFalsy: true })
    .isInt({ min: 0, max: 100 })
    .withMessage("Probability must be between 0 and 100"),

  body("expectedCloseDate")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Invalid date format"),

  body("assignedTo")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage("Invalid user ID"),

  body("description")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 }),

  body("notes").optional({ checkFalsy: true }).trim().isLength({ max: 2000 }),

  body("lostReason")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }),
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

  body("description")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 }),

  body("date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Invalid date format"),
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
