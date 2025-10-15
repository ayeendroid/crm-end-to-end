import { Router } from "express";
import { Deal } from "../models/Deal";
import requireAuth from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const deals = await Deal.find().skip(skip).limit(limit);
    const total = await Deal.countDocuments();

    res.json({
      success: true,
      data: {
        deals,
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
  asyncHandler(async (req, res) => {
    const deal = new Deal(req.body);
    await deal.save();
    res.status(201).json({
      success: true,
      data: deal,
    });
  })
);

router.get(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const deal = await Deal.findById(req.params.id);
    if (!deal)
      return res.status(404).json({
        success: false,
        error: { message: "Deal not found" },
      });
    res.json({
      success: true,
      data: deal,
    });
  })
);

router.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!deal)
      return res.status(404).json({
        success: false,
        error: { message: "Deal not found" },
      });
    res.json({
      success: true,
      data: deal,
    });
  })
);

router.delete(
  "/:id",
  requireAuth,
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
