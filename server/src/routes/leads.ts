import { Router } from "express";
import { Lead } from "../models/Lead";
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

    const leads = await Lead.find().skip(skip).limit(limit);
    const total = await Lead.countDocuments();

    res.json({
      success: true,
      data: {
        leads,
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
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json({
      success: true,
      data: lead,
    });
  })
);

router.get(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const lead = await Lead.findById(req.params.id);
    if (!lead)
      return res.status(404).json({
        success: false,
        error: { message: "Lead not found" },
      });
    res.json({
      success: true,
      data: lead,
    });
  })
);

router.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!lead)
      return res.status(404).json({
        success: false,
        error: { message: "Lead not found" },
      });
    res.json({
      success: true,
      data: lead,
    });
  })
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead)
      return res.status(404).json({
        success: false,
        error: { message: "Lead not found" },
      });
    res.json({
      success: true,
      data: { message: "Lead deleted successfully" },
    });
  })
);

export default router;
