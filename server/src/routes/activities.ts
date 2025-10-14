import { Router } from "express";
import { Activity } from "../models/Activity";
import requireAuth from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const activities = await Activity.find().limit(200);
  res.json(activities);
});

router.post("/", requireAuth, async (req, res) => {
  const activity = new Activity(req.body);
  await activity.save();
  res.status(201).json(activity);
});

router.get("/:id", requireAuth, async (req, res) => {
  const activity = await Activity.findById(req.params.id);
  if (!activity) return res.status(404).json({ message: "Not found" });
  res.json(activity);
});

router.put("/:id", requireAuth, async (req, res) => {
  const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(activity);
});

router.delete("/:id", requireAuth, async (req, res) => {
  await Activity.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
