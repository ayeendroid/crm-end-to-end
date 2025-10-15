import { Router, Request, Response } from "express";
import { Customer } from "../models/Customer";
import { Lead } from "../models/Lead";
import { Deal } from "../models/Deal";
import requireAuth from "../middleware/auth";

const router = Router();

// Apply authentication to all routes
router.use(requireAuth);

/**
 * GET /api/analytics/overview
 * Get high-level overview metrics
 */
router.get("/overview", async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    // Date range filter
    const dateFilter: any = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate as string);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate as string);
    }

    // Aggregate totals
    const [
      totalCustomers,
      activeCustomers,
      totalLeads,
      qualifiedLeads,
      totalDeals,
      wonDeals,
      totalRevenue,
      monthlyRevenue,
    ] = await Promise.all([
      // Total customers
      Customer.countDocuments({ ...dateFilter }),

      // Active customers
      Customer.countDocuments({ ...dateFilter, status: "active" }),

      // Total leads
      Lead.countDocuments({ ...dateFilter }),

      // Qualified leads
      Lead.countDocuments({ ...dateFilter, status: "qualified" }),

      // Total deals
      Deal.countDocuments({ ...dateFilter }),

      // Won deals
      Deal.countDocuments({ ...dateFilter, stage: "closed-won" }),

      // Total revenue (from won deals)
      Deal.aggregate([
        { $match: { stage: "closed-won" } },
        { $group: { _id: null, total: { $sum: "$value" } } },
      ]),

      // Monthly recurring revenue (from customers)
      Customer.aggregate([
        { $match: { status: "active" } },
        {
          $group: {
            _id: null,
            total: { $sum: "$ispData.plan.price" },
          },
        },
      ]),
    ]);

    // Calculate conversion rate
    const conversionRate =
      totalLeads > 0 ? ((wonDeals / totalLeads) * 100).toFixed(2) : "0";

    // Calculate average deal size
    const avgDealSize =
      wonDeals > 0 ? (totalRevenue[0]?.total || 0) / wonDeals : 0;

    res.json({
      success: true,
      data: {
        customers: {
          total: totalCustomers,
          active: activeCustomers,
          inactive: totalCustomers - activeCustomers,
        },
        leads: {
          total: totalLeads,
          qualified: qualifiedLeads,
        },
        deals: {
          total: totalDeals,
          won: wonDeals,
          lost: await Deal.countDocuments({ stage: "closed-lost" }),
        },
        revenue: {
          total: totalRevenue[0]?.total || 0,
          monthly: monthlyRevenue[0]?.total || 0,
          average: avgDealSize,
        },
        metrics: {
          conversionRate: parseFloat(conversionRate),
          winRate:
            totalDeals > 0 ? ((wonDeals / totalDeals) * 100).toFixed(2) : "0",
        },
      },
    });
  } catch (error) {
    console.error("Analytics overview error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics overview",
    });
  }
});

/**
 * GET /api/analytics/trends
 * Get trend data for charts (monthly data for last 12 months)
 */
router.get("/trends", async (req: Request, res: Response) => {
  try {
    const { months = 12 } = req.query;
    const monthsNum = parseInt(months as string);

    // Calculate date range for the last N months
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsNum);

    // Get monthly customer growth
    const customerTrends = await Customer.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Get monthly lead generation
    const leadTrends = await Lead.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Get monthly deal closures
    const dealTrends = await Deal.aggregate([
      {
        $match: {
          stage: "closed-won",
          actualCloseDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$actualCloseDate" },
            month: { $month: "$actualCloseDate" },
          },
          count: { $sum: 1 },
          revenue: { $sum: "$value" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Get monthly revenue
    const revenueTrends = await Deal.aggregate([
      {
        $match: {
          stage: "closed-won",
          actualCloseDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$actualCloseDate" },
            month: { $month: "$actualCloseDate" },
          },
          revenue: { $sum: "$value" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({
      success: true,
      data: {
        customers: customerTrends,
        leads: leadTrends,
        deals: dealTrends,
        revenue: revenueTrends,
      },
    });
  } catch (error) {
    console.error("Analytics trends error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics trends",
    });
  }
});

/**
 * GET /api/analytics/lead-performance
 * Get lead source performance and conversion metrics
 */
router.get("/lead-performance", async (req: Request, res: Response) => {
  try {
    // Lead by source
    const leadsBySource = await Lead.aggregate([
      {
        $group: {
          _id: "$source",
          count: { $sum: 1 },
          qualified: {
            $sum: { $cond: [{ $eq: ["$status", "qualified"] }, 1, 0] },
          },
          converted: {
            $sum: { $cond: [{ $eq: ["$status", "closed-won"] }, 1, 0] },
          },
          totalValue: { $sum: "$estimatedValue" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Lead by status
    const leadsByStatus = await Lead.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Lead score distribution
    const leadScoreDistribution = await Lead.aggregate([
      {
        $bucket: {
          groupBy: "$score",
          boundaries: [0, 20, 40, 60, 80, 100],
          default: "Other",
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);

    // Average time to conversion
    const conversionTime = await Lead.aggregate([
      {
        $match: {
          status: "closed-won",
          conversionDate: { $exists: true },
        },
      },
      {
        $project: {
          daysToConversion: {
            $divide: [
              { $subtract: ["$conversionDate", "$createdAt"] },
              1000 * 60 * 60 * 24, // Convert to days
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgDays: { $avg: "$daysToConversion" },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        bySource: leadsBySource,
        byStatus: leadsByStatus,
        scoreDistribution: leadScoreDistribution,
        avgConversionTime: conversionTime[0]?.avgDays || 0,
      },
    });
  } catch (error) {
    console.error("Lead performance error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lead performance data",
    });
  }
});

/**
 * GET /api/analytics/deal-pipeline
 * Get deal pipeline metrics and stage distribution
 */
router.get("/deal-pipeline", async (req: Request, res: Response) => {
  try {
    // Deals by stage
    const dealsByStage = await Deal.aggregate([
      {
        $group: {
          _id: "$stage",
          count: { $sum: 1 },
          totalValue: { $sum: "$value" },
          avgProbability: { $avg: "$probability" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Expected revenue (weighted by probability)
    const expectedRevenue = await Deal.aggregate([
      {
        $match: {
          stage: {
            $nin: ["closed-won", "closed-lost"],
          },
        },
      },
      {
        $project: {
          weightedValue: {
            $multiply: ["$value", { $divide: ["$probability", 100] }],
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$weightedValue" },
        },
      },
    ]);

    // Average deal cycle time
    const dealCycleTime = await Deal.aggregate([
      {
        $match: {
          stage: "closed-won",
          actualCloseDate: { $exists: true },
        },
      },
      {
        $project: {
          cycleDays: {
            $divide: [
              { $subtract: ["$actualCloseDate", "$createdAt"] },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgDays: { $avg: "$cycleDays" },
        },
      },
    ]);

    // Top deals
    const topDealsDocs = await Deal.find({
      stage: { $nin: ["closed-won", "closed-lost"] },
    })
      .sort({ value: -1 })
      .limit(5)
      .populate("customer", "firstName lastName company")
      .populate("assignedTo", "firstName lastName email")
      .lean();

    const topDeals = topDealsDocs.map((deal: any) => ({
      ...deal,
      assignedTo: deal.assignedTo
        ? {
            _id: deal.assignedTo._id,
            name: [deal.assignedTo.firstName, deal.assignedTo.lastName]
              .filter(Boolean)
              .join(" ")
              .trim(),
            email: deal.assignedTo.email,
          }
        : undefined,
      customer: deal.customer
        ? {
            _id: deal.customer._id,
            firstName: deal.customer.firstName,
            lastName: deal.customer.lastName,
            company: deal.customer.company,
          }
        : undefined,
    }));

    res.json({
      success: true,
      data: {
        byStage: dealsByStage,
        expectedRevenue: expectedRevenue[0]?.total || 0,
        avgCycleTime: dealCycleTime[0]?.avgDays || 0,
        topDeals,
      },
    });
  } catch (error) {
    console.error("Deal pipeline error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch deal pipeline data",
    });
  }
});

/**
 * GET /api/analytics/customer-insights
 * Get customer segmentation and behavior insights
 */
router.get("/customer-insights", async (req: Request, res: Response) => {
  try {
    // Customer by status
    const customersByStatus = await Customer.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Customer by plan type (ISP specific)
    const customersByPlanType = await Customer.aggregate([
      {
        $match: {
          "ispData.plan.type": { $exists: true },
        },
      },
      {
        $group: {
          _id: "$ispData.plan.type",
          count: { $sum: 1 },
          avgPrice: { $avg: "$ispData.plan.price" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Churn risk distribution
    const churnRiskDistribution = await Customer.aggregate([
      {
        $match: {
          "ispData.churnRisk": { $exists: true },
        },
      },
      {
        $group: {
          _id: "$ispData.churnRisk",
          count: { $sum: 1 },
        },
      },
    ]);

    // Average NPS score
    const npsData = await Customer.aggregate([
      {
        $match: {
          "ispData.npsScore": { $exists: true },
        },
      },
      {
        $group: {
          _id: null,
          avgNPS: { $avg: "$ispData.npsScore" },
          promoters: {
            $sum: { $cond: [{ $gte: ["$ispData.npsScore", 9] }, 1, 0] },
          },
          passives: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$ispData.npsScore", 7] },
                    { $lte: ["$ispData.npsScore", 8] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          detractors: {
            $sum: { $cond: [{ $lte: ["$ispData.npsScore", 6] }, 1, 0] },
          },
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          avgNPS: 1,
          promoters: 1,
          passives: 1,
          detractors: 1,
          npsScore: {
            $multiply: [
              {
                $divide: [
                  { $subtract: ["$promoters", "$detractors"] },
                  "$total",
                ],
              },
              100,
            ],
          },
        },
      },
    ]);

    // Customer lifetime value distribution
    const lifetimeValueStats = await Customer.aggregate([
      {
        $match: {
          "ispData.lifetimeValue": { $exists: true, $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          avgLTV: { $avg: "$ispData.lifetimeValue" },
          totalLTV: { $sum: "$ispData.lifetimeValue" },
          maxLTV: { $max: "$ispData.lifetimeValue" },
          minLTV: { $min: "$ispData.lifetimeValue" },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        byStatus: customersByStatus,
        byPlanType: customersByPlanType,
        churnRisk: churnRiskDistribution,
        nps: npsData[0] || { avgNPS: 0, npsScore: 0 },
        lifetimeValue: lifetimeValueStats[0] || {
          avgLTV: 0,
          totalLTV: 0,
        },
      },
    });
  } catch (error) {
    console.error("Customer insights error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer insights",
    });
  }
});

/**
 * GET /api/analytics/team-performance
 * Get team member performance metrics
 */
router.get("/team-performance", async (req: Request, res: Response) => {
  try {
    // Leads by assigned user
    const leadsByUser = await Lead.aggregate([
      {
        $group: {
          _id: "$assignedTo",
          totalLeads: { $sum: 1 },
          converted: {
            $sum: { $cond: [{ $eq: ["$status", "closed-won"] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          userEmail: "$user.email",
          totalLeads: 1,
          converted: 1,
          conversionRate: {
            $cond: [
              { $gt: ["$totalLeads", 0] },
              {
                $multiply: [{ $divide: ["$converted", "$totalLeads"] }, 100],
              },
              0,
            ],
          },
          userFirstName: { $ifNull: ["$user.firstName", ""] },
          userLastName: { $ifNull: ["$user.lastName", ""] },
        },
      },
      { $sort: { converted: -1 } },
    ]);

    const dealsByUser = await Deal.aggregate([
      {
        $group: {
          _id: "$assignedTo",
          totalDeals: { $sum: 1 },
          wonDeals: {
            $sum: { $cond: [{ $eq: ["$stage", "closed-won"] }, 1, 0] },
          },
          totalRevenue: {
            $sum: { $cond: [{ $eq: ["$stage", "closed-won"] }, "$value", 0] },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          userEmail: "$user.email",
          totalDeals: 1,
          wonDeals: 1,
          totalRevenue: 1,
          winRate: {
            $cond: [
              { $gt: ["$totalDeals", 0] },
              {
                $multiply: [{ $divide: ["$wonDeals", "$totalDeals"] }, 100],
              },
              0,
            ],
          },
          userFirstName: { $ifNull: ["$user.firstName", ""] },
          userLastName: { $ifNull: ["$user.lastName", ""] },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        leadPerformance: leadsByUser.map(
          ({ userFirstName, userLastName, ...rest }) => ({
            ...rest,
            userName: `${userFirstName} ${userLastName}`
              .trim()
              .replace(/\s+/g, " "),
          })
        ),
        dealPerformance: dealsByUser.map(
          ({ userFirstName, userLastName, ...rest }) => ({
            ...rest,
            userName: `${userFirstName} ${userLastName}`
              .trim()
              .replace(/\s+/g, " "),
          })
        ),
      },
    });
  } catch (error) {
    console.error("Team performance error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch team performance data",
    });
  }
});

export default router;
