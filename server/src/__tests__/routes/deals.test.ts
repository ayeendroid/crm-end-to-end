import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import dealRoutes from "../../routes/deals";
import { Deal } from "../../models/Deal";
import { Customer } from "../../models/Customer";
import { User } from "../../models/User";
import {
  generateAuthToken,
  mockDeal,
  mockCustomer,
  mockUser,
  createTestUser,
} from "../helpers/testUtils";

// Create Express app for testing
const app = express();
app.use(express.json());
app.use("/api/deals", dealRoutes);

describe("Deal Routes", () => {
  let authToken: string;
  let userId: string;
  let customerId: string;

  beforeEach(async () => {
    // Create test user
    const { user, token } = await createTestUser(User);
    authToken = token;
    userId = user._id.toString();

    // Create test customer
    const customer = await Customer.create({
      ...mockCustomer,
      assignedTo: userId,
    });
    customerId = customer._id.toString();
  });

  describe("POST /api/deals", () => {
    it("should create a new deal with valid data", async () => {
      const dealData = {
        ...mockDeal(customerId),
        assignedTo: userId,
      };

      const response = await request(app)
        .post("/api/deals")
        .set("Authorization", `Bearer ${authToken}`)
        .send(dealData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("_id");
      expect(response.body.data.title).toBe(dealData.title);
      expect(response.body.data.value).toBe(dealData.value);
      expect(response.body.data.stage).toBe(dealData.stage);
      expect(response.body.data.probability).toBe(dealData.probability);
    });

    it("should fail to create deal without authentication", async () => {
      const dealData = {
        ...mockDeal(customerId),
        assignedTo: userId,
      };

      await request(app).post("/api/deals").send(dealData).expect(401);
    });

    it("should fail to create deal without required fields", async () => {
      const invalidDeal = {
        title: "Test Deal",
        // Missing required fields: value, customer, assignedTo, expectedCloseDate
      };

      await request(app)
        .post("/api/deals")
        .set("Authorization", `Bearer ${authToken}`)
        .send(invalidDeal)
        .expect(400); // Validation middleware returns 400
    });

    it("should create deal with correct default values", async () => {
      const dealData = {
        title: "Test Deal",
        value: 25000,
        customer: customerId,
        assignedTo: userId,
        expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

      const response = await request(app)
        .post("/api/deals")
        .set("Authorization", `Bearer ${authToken}`)
        .send(dealData)
        .expect(201);

      expect(response.body.data.stage).toBe("prospecting"); // Default stage
      expect(response.body.data.probability).toBe(10); // Default probability
      expect(response.body.data.tags).toEqual([]);
    });
  });

  describe("GET /api/deals", () => {
    beforeEach(async () => {
      // Create multiple test deals
      const deals = Array.from({ length: 15 }, (_, i) => ({
        ...mockDeal(customerId),
        title: `Test Deal ${i + 1}`,
        value: 10000 * (i + 1),
        assignedTo: userId,
      }));

      await Deal.insertMany(deals);
    });

    it("should return paginated deals", async () => {
      const response = await request(app)
        .get("/api/deals")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.deals).toHaveLength(15);
      expect(response.body.data.pagination).toHaveProperty("total", 15);
      expect(response.body.data.pagination).toHaveProperty("page", 1);
      expect(response.body.data.pagination).toHaveProperty("limit", 50);
    });

    it("should handle pagination parameters", async () => {
      const response = await request(app)
        .get("/api/deals?page=2&limit=5")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.deals).toHaveLength(5);
      expect(response.body.data.pagination.page).toBe(2);
      expect(response.body.data.pagination.limit).toBe(5);
      expect(response.body.data.pagination.total).toBe(15);
      expect(response.body.data.pagination.pages).toBe(3);
    });

    it("should fail to get deals without authentication", async () => {
      await request(app).get("/api/deals").expect(401);
    });

    it("should return empty array when no deals exist", async () => {
      await Deal.deleteMany({});

      const response = await request(app)
        .get("/api/deals")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.deals).toHaveLength(0);
      expect(response.body.data.pagination.total).toBe(0);
    });
  });

  describe("GET /api/deals/:id", () => {
    let dealId: string;

    beforeEach(async () => {
      const deal = await Deal.create({
        ...mockDeal(customerId),
        assignedTo: userId,
      });
      dealId = deal._id.toString();
    });

    it("should return a deal by id", async () => {
      const response = await request(app)
        .get(`/api/deals/${dealId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(dealId);
      expect(response.body.data).toHaveProperty("title");
      expect(response.body.data).toHaveProperty("value");
      expect(response.body.data).toHaveProperty("stage");
    });

    it("should return 404 for non-existent deal", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .get(`/api/deals/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe("Deal not found");
    });

    it("should fail with invalid ObjectId", async () => {
      await request(app)
        .get("/api/deals/invalid-id")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(400); // Validation middleware returns 400
    });

    it("should fail to get deal without authentication", async () => {
      await request(app).get(`/api/deals/${dealId}`).expect(401);
    });
  });

  describe("PUT /api/deals/:id", () => {
    let dealId: string;

    beforeEach(async () => {
      const deal = await Deal.create({
        ...mockDeal(customerId),
        assignedTo: userId,
      });
      dealId = deal._id.toString();
    });

    it("should update a deal", async () => {
      const updates = {
        title: "Updated Deal Title",
        value: 75000,
        stage: "negotiation" as const,
        probability: 80,
      };

      const response = await request(app)
        .put(`/api/deals/${dealId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updates)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updates.title);
      expect(response.body.data.value).toBe(updates.value);
      expect(response.body.data.stage).toBe(updates.stage);
      expect(response.body.data.probability).toBe(updates.probability);
    });

    it("should update deal stage to closed-won", async () => {
      const updates = {
        stage: "closed-won" as const,
        probability: 100,
        actualCloseDate: new Date(),
      };

      const response = await request(app)
        .put(`/api/deals/${dealId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updates)
        .expect(200);

      expect(response.body.data.stage).toBe("closed-won");
      expect(response.body.data.probability).toBe(100);
      expect(response.body.data.actualCloseDate).toBeDefined();
    });

    it("should update deal stage to closed-lost with reason", async () => {
      const updates = {
        stage: "closed-lost" as const,
        probability: 0,
        lostReason: "Price too high",
        actualCloseDate: new Date(),
      };

      const response = await request(app)
        .put(`/api/deals/${dealId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updates)
        .expect(200);

      expect(response.body.data.stage).toBe("closed-lost");
      expect(response.body.data.lostReason).toBe("Price too high");
    });

    it("should return 404 for non-existent deal", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .put(`/api/deals/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ title: "Updated" })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe("Deal not found");
    });

    it("should fail to update deal without authentication", async () => {
      await request(app)
        .put(`/api/deals/${dealId}`)
        .send({ title: "Updated" })
        .expect(401);
    });

    it("should update tags array", async () => {
      const updates = {
        tags: ["enterprise", "high-priority", "q4-2025"],
      };

      const response = await request(app)
        .put(`/api/deals/${dealId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updates)
        .expect(200);

      expect(response.body.data.tags).toEqual(updates.tags);
    });
  });

  describe("DELETE /api/deals/:id", () => {
    let dealId: string;

    beforeEach(async () => {
      const deal = await Deal.create({
        ...mockDeal(customerId),
        assignedTo: userId,
      });
      dealId = deal._id.toString();
    });

    it("should delete a deal", async () => {
      const response = await request(app)
        .delete(`/api/deals/${dealId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe("Deal deleted successfully");

      // Verify deal is actually deleted
      const deletedDeal = await Deal.findById(dealId);
      expect(deletedDeal).toBeNull();
    });

    it("should return 404 for non-existent deal", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .delete(`/api/deals/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe("Deal not found");
    });

    it("should fail to delete deal without authentication", async () => {
      await request(app).delete(`/api/deals/${dealId}`).expect(401);
    });

    it("should not affect other deals when deleting one", async () => {
      // Create another deal
      const anotherDeal = await Deal.create({
        ...mockDeal(customerId),
        title: "Another Deal",
        assignedTo: userId,
      });

      // Delete first deal
      await request(app)
        .delete(`/api/deals/${dealId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      // Verify second deal still exists
      const existingDeal = await Deal.findById(anotherDeal._id);
      expect(existingDeal).not.toBeNull();
      expect(existingDeal?.title).toBe("Another Deal");
    });
  });

  describe("Deal Business Logic", () => {
    it("should calculate deal pipeline correctly by stage", async () => {
      // Create deals in different stages
      const stages = [
        "prospecting",
        "qualification",
        "proposal",
        "negotiation",
        "closed-won",
        "closed-lost",
      ];

      for (const stage of stages) {
        await Deal.create({
          ...mockDeal(customerId),
          stage: stage as any,
          title: `Deal in ${stage}`,
          assignedTo: userId,
        });
      }

      const response = await request(app)
        .get("/api/deals")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.deals).toHaveLength(6);

      // Verify each stage has a deal
      const dealStages = response.body.data.deals.map((d: any) => d.stage);
      stages.forEach((stage) => {
        expect(dealStages).toContain(stage);
      });
    });

    it("should handle deals with different probabilities", async () => {
      const probabilities = [10, 25, 50, 75, 100];

      for (const prob of probabilities) {
        await Deal.create({
          ...mockDeal(customerId),
          probability: prob,
          assignedTo: userId,
        });
      }

      const response = await request(app)
        .get("/api/deals")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.deals).toHaveLength(5);

      // Verify probabilities are correctly stored
      const dealProbs = response.body.data.deals.map((d: any) => d.probability);
      probabilities.forEach((prob) => {
        expect(dealProbs).toContain(prob);
      });
    });

    it("should maintain deal value as number", async () => {
      const deal = await Deal.create({
        ...mockDeal(customerId),
        value: 99999.99,
        assignedTo: userId,
      });

      const response = await request(app)
        .get(`/api/deals/${deal._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(typeof response.body.data.value).toBe("number");
      expect(response.body.data.value).toBe(99999.99);
    });
  });
});
