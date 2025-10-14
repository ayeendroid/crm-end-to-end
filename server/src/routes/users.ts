import { Router } from "express";
import { User } from "../models/User";
import requireAuth from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const users = await User.find().limit(200).select("-password");
  res.json(users);
});

router.get("/:id", requireAuth, async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "Not found" });
  res.json(user);
});

export default router;
