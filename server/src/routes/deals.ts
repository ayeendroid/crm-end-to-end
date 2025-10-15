import { Router } from "express";
import { Deal } from "../models/Deal";
import requireAuth from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import {
  validateDeal,
  validateDealUpdate,
  validateObjectId,
  validatePagination,
} from "../middleware/validators";
import { checkValidationResult } from "../middleware/validateRequest";

const customerProjection = "firstName lastName company email";
const assignedToProjection = "firstName lastName email";

const formatDeal = (deal: any) => {
  if (!deal) {
    return deal;
  }

  const plainDeal =
    typeof deal.toObject === "function" ? deal.toObject() : { ...deal };

  const formattedAssignedTo = plainDeal.assignedTo
    ? {
        _id: plainDeal.assignedTo._id,
        name: [plainDeal.assignedTo.firstName, plainDeal.assignedTo.lastName]
          .filter(Boolean)
          .join(" ")
          .trim(),
        email: plainDeal.assignedTo.email,
      }
    : undefined;

  const formattedCustomer = plainDeal.customer
    ? {
        _id: plainDeal.customer._id,
        firstName: plainDeal.customer.firstName,
        lastName: plainDeal.customer.lastName,
        company: plainDeal.customer.company,
        email: plainDeal.customer.email,
      }
    : undefined;

  return {
    ...plainDeal,
    assignedTo: formattedAssignedTo,
    customer: formattedCustomer,
  };
};

const router = Router();

router.get(
  "/",
  requireAuth,
  validatePagination,
  checkValidationResult,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const deals = await Deal.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("customer", customerProjection)
      .populate("assignedTo", assignedToProjection);
    const total = await Deal.countDocuments();

    res.json({
      success: true,
      data: {
        deals: deals.map(formatDeal),
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  })
);

router.post(
  "/",
  requireAuth,
  validateDeal,
  checkValidationResult,
  asyncHandler(async (req, res) => {
    const deal = new Deal(req.body);
    await deal.save();
    await deal.populate([
      { path: "customer", select: customerProjection },
      { path: "assignedTo", select: assignedToProjection },
    ]);

    res.status(201).json({
      success: true,
      data: formatDeal(deal),
    });
  })
);

router.get(
  "/:id",
  requireAuth,
  validateObjectId,
  checkValidationResult,
  asyncHandler(async (req, res) => {
    const deal = await Deal.findById(req.params.id)
      .populate("customer", customerProjection)
      .populate("assignedTo", assignedToProjection);
    if (!deal)
      return res.status(404).json({
        success: false,
        error: { message: "Deal not found" },
      });
    res.json({
      success: true,
      data: formatDeal(deal),
    });
  })
);

router.put(
  "/:id",
  requireAuth,
  validateObjectId,
  validateDealUpdate,
  checkValidationResult,
  asyncHandler(async (req, res) => {
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("customer", customerProjection)
      .populate("assignedTo", assignedToProjection);
    if (!deal)
      return res.status(404).json({
        success: false,
        error: { message: "Deal not found" },
      });
    res.json({
      success: true,
      data: formatDeal(deal),
    });
  })
);

router.delete(
  "/:id",
  requireAuth,
  validateObjectId,
  checkValidationResult,
  asyncHandler(async (req, res) => {
    const deal = await Deal.findByIdAndDelete(req.params.id);
    if (!deal)
      return res.status(404).json({
        success: false,
        error: { message: "Deal not found" },
      });
    res.json({
      success: true,
      data: { message: "Deal deleted successfully" },
    });
  })
);

export default router;
