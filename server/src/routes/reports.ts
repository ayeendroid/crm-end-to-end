import { Router, Request, Response } from "express";
import requireAuth from "../middleware/auth";
import { Customer } from "../models/Customer";
import { Lead } from "../models/Lead";
import { Deal } from "../models/Deal";

const router = Router();

router.get("/sales-performance", requireAuth, async (req: Request, res: Response) => {
  try {
    const deals = await Deal.find();
    const wonDeals = deals.filter((d: any) => d.stage === "closed-won");
    const totalRevenue = wonDeals.reduce((sum: number, d: any) => sum + d.value, 0);
    
    res.json({
      success: true,
      data: {
        totalDeals: deals.length,
        wonDeals: wonDeals.length,
        totalRevenue
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/lead-analytics", requireAuth, async (req: Request, res: Response) => {
  try {
    const leads = await Lead.find();
    const qualified = leads.filter((l: any) => l.status === "qualified").length;
    
    res.json({
      success: true,
      data: {
        totalLeads: leads.length,
        qualifiedLeads: qualified
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/customer-metrics", requireAuth, async (req: Request, res: Response) => {
  try {
    const customers = await Customer.find();
    const active = customers.filter((c: any) => c.status === "active").length;
    
    res.json({
      success: true,
      data: {
        totalCustomers: customers.length,
        activeCustomers: active
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
