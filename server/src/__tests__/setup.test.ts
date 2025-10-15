import request from "supertest";
import express from "express";
import { generateAuthToken } from "./helpers/testUtils";

describe("Test Setup Verification", () => {
  it("should verify test environment is working", () => {
    expect(process.env.NODE_ENV).toBe("test");
    expect(process.env.JWT_SECRET).toBe("test-secret-key-for-testing-only");
  });

  it("should generate auth token", () => {
    const userId = "123456789";
    const token = generateAuthToken(userId);

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });

  it("should make basic HTTP request with supertest", async () => {
    const app = express();
    app.get("/test", (req, res) => {
      res.status(200).json({ message: "Test successful" });
    });

    const response = await request(app).get("/test").expect(200);

    expect(response.body).toEqual({ message: "Test successful" });
  });
});
