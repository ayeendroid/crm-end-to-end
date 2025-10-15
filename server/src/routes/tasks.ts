import { Router } from "express";
import { Task } from "../models/Task";
import requireAuth, { AuthRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

// Get all tasks with filtering
router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};

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

    if (req.query.overdue === "true") {
      filter.dueDate = { $lt: new Date() };
      filter.status = { $nin: ["completed", "cancelled"] };
    }

    if (req.query.dueToday === "true") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      filter.dueDate = { $gte: today, $lt: tomorrow };
    }

    if (req.query.startDate || req.query.endDate) {
      filter.dueDate = {};
      if (req.query.startDate) {
        filter.dueDate.$gte = new Date(req.query.startDate as string);
      }
      if (req.query.endDate) {
        filter.dueDate.$lte = new Date(req.query.endDate as string);
      }
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ dueDate: 1, priority: -1, createdAt: -1 });

    const total = await Task.countDocuments(filter);

    res.json({
      success: true,
      data: {
        tasks,
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

// Create new task
router.post(
  "/",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const task = new Task({
      ...req.body,
      createdBy: req.user._id,
    });
    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      data: populatedTask,
    });
  })
);

// Get single task
router.get(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        error: { message: "Task not found" },
      });
    }

    res.json({
      success: true,
      data: task,
    });
  })
);

// Update task
router.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        error: { message: "Task not found" },
      });
    }

    res.json({
      success: true,
      data: task,
    });
  })
);

// Delete task
router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: { message: "Task not found" },
      });
    }

    res.json({
      success: true,
      data: { message: "Task deleted successfully" },
    });
  })
);

// Update task checklist item
router.patch(
  "/:id/checklist/:itemIndex",
  requireAuth,
  asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: { message: "Task not found" },
      });
    }

    const itemIndex = parseInt(req.params.itemIndex);
    if (itemIndex < 0 || itemIndex >= task.checklist.length) {
      return res.status(400).json({
        success: false,
        error: { message: "Invalid checklist item index" },
      });
    }

    task.checklist[itemIndex].completed = req.body.completed;
    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.json({
      success: true,
      data: populatedTask,
    });
  })
);

// Get task statistics
router.get(
  "/stats/summary",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const userId = req.query.userId || req.user._id;

    const stats = await Task.aggregate([
      {
        $match: {
          assignedTo: userId,
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const overdue = await Task.countDocuments({
      assignedTo: userId,
      dueDate: { $lt: new Date() },
      status: { $nin: ["completed", "cancelled"] },
    });

    const dueToday = await Task.countDocuments({
      assignedTo: userId,
      dueDate: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999)),
      },
      status: { $nin: ["completed", "cancelled"] },
    });

    res.json({
      success: true,
      data: {
        byStatus: stats,
        overdue,
        dueToday,
      },
    });
  })
);

export default router;
