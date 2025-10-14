import { Router } from "express";
import { Deal } from "../models/Deal";
import requireAuth from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const deals = await Deal.find().limit(200);
  res.json(deals);
});

router.post("/", requireAuth, async (req, res) => {
  const deal = new Deal(req.body);
  await deal.save();
  res.status(201).json(deal);
});

router.get("/:id", requireAuth, async (req, res) => {
  const deal = await Deal.findById(req.params.id);
  if (!deal) return res.status(404).json({ message: "Not found" });
  res.json(deal);
});

router.put("/:id", requireAuth, async (req, res) => {
  const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(deal);
});

router.delete("/:id", requireAuth, async (req, res) => {
  await Deal.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
