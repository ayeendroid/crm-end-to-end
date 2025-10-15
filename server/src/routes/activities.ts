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

    // Build filter
    const filter: any = {};

    if (req.query.type) {
      filter.type = req.query.type;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    if (req.query.assignedTo) {
      filter.assignedTo = req.query.assignedTo;
    }

    if (req.query.relatedToType && req.query.relatedToId) {
      filter["relatedTo.type"] = req.query.relatedToType;
      filter["relatedTo.id"] = req.query.relatedToId;
    }

    if (req.query.startDate || req.query.endDate) {
      filter.scheduledDate = {};
      if (req.query.startDate) {
        filter.scheduledDate.$gte = new Date(req.query.startDate as string);
      }
      if (req.query.endDate) {
        filter.scheduledDate.$lte = new Date(req.query.endDate as string);
      }
    }

    const activities = await Activity.find(filter)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("attendees", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ scheduledDate: -1, createdAt: -1 });

    const total = await Activity.countDocuments(filter);

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
    const activity = await Activity.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("attendees", "name email");

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
