import { Router } from "express";
import { Customer } from "../models/Customer";
import requireAuth from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const customers = await Customer.find().limit(100);
  res.json(customers);
});

router.post("/", requireAuth, async (req, res) => {
  const data = req.body;
  const customer = new Customer(data);
  await customer.save();
  res.status(201).json(customer);
});

router.get("/:id", requireAuth, async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).json({ message: "Not found" });
  res.json(customer);
});

router.put("/:id", requireAuth, async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(customer);
});

router.delete("/:id", requireAuth, async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
