import { Router } from "express";
import { Customer } from "../models/Customer";
import requireAuth from "../middleware/auth";
import {
  validateCustomer,
  validateCustomerUpdate,
  validateObjectId,
  validatePagination,
} from "../middleware/validators";
import { checkValidationResult } from "../middleware/validateRequest";
import { asyncHandler, AppError } from "../middleware/errorHandler";

const router = Router();

// Get all customers with pagination
router.get(
  "/",
  requireAuth,
  validatePagination,
  checkValidationResult,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    // Get filters from query
    const filters: any = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.source) filters.source = req.query.source;

    if (req.query.search) {
      const searchTerm = req.query.search as string;

      // Sanitize input to prevent regex injection
      const escapeRegex = (str: string) =>
        str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const trimmedSearch = searchTerm.trim();
      const safeTerm = escapeRegex(trimmedSearch);

      // Smart search: Matches across individual fields AND concatenated fullName
      filters.$or = [
        // Search in firstName
        { firstName: { $regex: safeTerm, $options: "i" } },
        // Search in lastName
        { lastName: { $regex: safeTerm, $options: "i" } },
        // Search in email
        { email: { $regex: safeTerm, $options: "i" } },
        // Search in company
        { company: { $regex: safeTerm, $options: "i" } },
        // Search in concatenated full name using $expr
        {
          $expr: {
            $regexMatch: {
              input: { $concat: ["$firstName", " ", "$lastName"] },
              regex: safeTerm,
              options: "i",
            },
          },
        },
      ];
    }

    const [customers, total] = await Promise.all([
      Customer.find(filters)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate("assignedTo", "firstName lastName email")
        .lean(),
      Customer.countDocuments(filters),
    ]);

    res.json({
      success: true,
      data: {
        customers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  })
);

// Create customer
router.post(
  "/",
  requireAuth,
  validateCustomer,
  checkValidationResult,
  asyncHandler(async (req, res) => {
    const customerData = {
      ...req.body,
      // Use provided assignedTo if present (for lead conversion), otherwise use current user
      assignedTo: req.body.assignedTo || (req as any).user.id,
    };

    const customer = new Customer(customerData);
    await customer.save();

    res.status(201).json({
      success: true,
      data: { customer },
      message: "Customer created successfully",
    });
  })
);

// Get single customer
router.get(
  "/:id",
  requireAuth,
  validateObjectId,
  checkValidationResult,
  asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.params.id).populate(
      "assignedTo",
      "firstName lastName email"
    );

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    res.json({
      success: true,
      data: { customer },
    });
  })
);

// Update customer
router.put(
  "/:id",
  requireAuth,
  validateObjectId,
  validateCustomerUpdate,
  checkValidationResult,
  asyncHandler(async (req, res) => {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate("assignedTo", "firstName lastName email");

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    res.json({
      success: true,
      data: { customer },
      message: "Customer updated successfully",
    });
  })
);

// Delete customer
router.delete(
  "/:id",
  requireAuth,
  validateObjectId,
  checkValidationResult,
  asyncHandler(async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    res.json({
      success: true,
      message: "Customer deleted successfully",
    });
  })
);

export default router;
