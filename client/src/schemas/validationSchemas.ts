import { z } from "zod";

// Phone number regex (Indian format)
const phoneRegex =
  /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;

// Customer Schema
export const customerSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .trim(),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .trim(),

  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),

  phone: z
    .string()
    .regex(
      phoneRegex,
      "Please enter a valid phone number (e.g., +91 98765 43210)"
    )
    .optional()
    .or(z.literal("")),

  company: z
    .string()
    .max(100, "Company name must not exceed 100 characters")
    .optional()
    .or(z.literal("")),

  jobTitle: z
    .string()
    .max(100, "Job title must not exceed 100 characters")
    .optional()
    .or(z.literal("")),

  industry: z
    .string()
    .max(100, "Industry must not exceed 100 characters")
    .optional()
    .or(z.literal("")),

  website: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),

  status: z
    .enum(["active", "inactive", "prospect"], {
      errorMap: () => ({ message: "Please select a valid status" }),
    })
    .optional(),

  source: z
    .enum(
      ["website", "referral", "social", "email", "phone", "event", "other"],
      {
        errorMap: () => ({ message: "Please select a valid source" }),
      }
    )
    .optional(),

  notes: z
    .string()
    .max(1000, "Notes must not exceed 1000 characters")
    .optional()
    .or(z.literal("")),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

// Customer Update Schema (all fields optional)
export const customerUpdateSchema = customerSchema.partial();

// Lead Schema
export const leadSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),

  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),

  phone: z
    .string()
    .regex(phoneRegex, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),

  company: z
    .string()
    .max(100, "Company name must not exceed 100 characters")
    .optional()
    .or(z.literal("")),

  status: z
    .enum(["new", "contacted", "qualified", "converted", "lost"], {
      errorMap: () => ({ message: "Please select a valid status" }),
    })
    .optional(),

  source: z
    .enum(
      ["website", "referral", "social", "email", "phone", "event", "other"],
      {
        errorMap: () => ({ message: "Please select a valid source" }),
      }
    )
    .optional(),

  notes: z
    .string()
    .max(1000, "Notes must not exceed 1000 characters")
    .optional()
    .or(z.literal("")),
});

export type LeadFormData = z.infer<typeof leadSchema>;

// Deal Schema
export const dealSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters")
    .trim(),

  value: z
    .number({
      required_error: "Deal value is required",
      invalid_type_error: "Deal value must be a number",
    })
    .positive("Deal value must be greater than 0")
    .min(0, "Deal value cannot be negative"),

  stage: z
    .enum(
      [
        "lead",
        "qualified",
        "proposal",
        "negotiation",
        "closed-won",
        "closed-lost",
      ],
      {
        errorMap: () => ({ message: "Please select a valid stage" }),
      }
    )
    .optional(),

  probability: z
    .number()
    .int("Probability must be a whole number")
    .min(0, "Probability must be between 0 and 100")
    .max(100, "Probability must be between 0 and 100")
    .optional(),

  expectedCloseDate: z
    .string()
    .datetime("Please enter a valid date")
    .or(z.date())
    .optional(),

  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .optional()
    .or(z.literal("")),
});

export type DealFormData = z.infer<typeof dealSchema>;

// Authentication Schemas
export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),

  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters")
      .trim(),

    email: z
      .string()
      .email("Please enter a valid email address")
      .toLowerCase()
      .trim(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),

    confirmPassword: z.string(),

    role: z
      .enum(["admin", "manager", "sales", "support"], {
        errorMap: () => ({ message: "Please select a valid role" }),
      })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// Activity Schema
export const activitySchema = z.object({
  type: z.enum(["call", "email", "meeting", "note", "task", "deal", "other"], {
    errorMap: () => ({ message: "Please select a valid activity type" }),
  }),

  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters")
    .trim(),

  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .optional()
    .or(z.literal("")),

  date: z
    .string()
    .datetime("Please enter a valid date")
    .or(z.date())
    .optional(),
});

export type ActivityFormData = z.infer<typeof activitySchema>;

// BharatNet ISP Customer Schema (for ISP-specific features)
export const ispCustomerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),

  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),

  phone: z
    .string()
    .regex(
      /^\+91\s?\d{10}$/,
      "Please enter a valid Indian phone number (+91 XXXXXXXXXX)"
    ),

  planType: z.enum(["Fiber", "Broadband", "Wireless"], {
    errorMap: () => ({ message: "Please select a valid plan type" }),
  }),

  planSpeed: z.enum(["50Mbps", "100Mbps", "200Mbps", "500Mbps", "1Gbps"], {
    errorMap: () => ({ message: "Please select a valid plan speed" }),
  }),

  planPrice: z
    .number()
    .positive("Plan price must be greater than 0")
    .min(299, "Minimum plan price is ₹299")
    .max(9999, "Maximum plan price is ₹9,999"),

  billingCycle: z.enum(["Monthly", "Quarterly", "Annual"], {
    errorMap: () => ({ message: "Please select a valid billing cycle" }),
  }),

  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City must not exceed 50 characters"),

  state: z
    .string()
    .min(2, "State must be at least 2 characters")
    .max(50, "State must not exceed 50 characters"),

  pincode: z.string().regex(/^\d{6}$/, "Please enter a valid 6-digit pincode"),

  status: z.enum(["Active", "Suspended", "Cancelled"], {
    errorMap: () => ({ message: "Please select a valid status" }),
  }),
});

export type ISPCustomerFormData = z.infer<typeof ispCustomerSchema>;

// Search/Filter Schema
export const searchFilterSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  source: z.string().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

export type SearchFilterData = z.infer<typeof searchFilterSchema>;
