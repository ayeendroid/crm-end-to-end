import { Router } from "express";
import { Activity } from "../models/Activity";
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

    const activities = await Activity.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await Activity.countDocuments();

    res.json({
      success: true,
      data: {
        activities,
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
    const activity = new Activity(req.body);
    await activity.save();
    res.status(201).json({
      success: true,
      data: activity,
    });
  })
);

router.get(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const activity = await Activity.findById(req.params.id);
    if (!activity)
      return res.status(404).json({
        success: false,
        error: { message: "Activity not found" },
      });
    res.json({
      success: true,
      data: activity,
    });
  })
);

router.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!activity)
      return res.status(404).json({
        success: false,
        error: { message: "Activity not found" },
      });
    res.json({
      success: true,
      data: activity,
    });
  })
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity)
      return res.status(404).json({
        success: false,
        error: { message: "Activity not found" },
      });
    res.json({
      success: true,
      data: { message: "Activity deleted successfully" },
    });
  })
);

export default router;
