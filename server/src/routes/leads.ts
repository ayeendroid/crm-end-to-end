import { Router } from "express";
import { Lead } from "../models/Lead";
import requireAuth from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const leads = await Lead.find().limit(200);
  res.json(leads);
});

router.post("/", requireAuth, async (req, res) => {
  const lead = new Lead(req.body);
  await lead.save();
  res.status(201).json(lead);
});

router.get("/:id", requireAuth, async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) return res.status(404).json({ message: "Not found" });
  res.json(lead);
});

router.put("/:id", requireAuth, async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(lead);
});

router.delete("/:id", requireAuth, async (req, res) => {
  await Lead.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
