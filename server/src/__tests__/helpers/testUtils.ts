import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";

let mongoServer: MongoMemoryServer;

/**
 * Connect to the in-memory database
 */
export const connectDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
};

/**
 * Drop database, close the connection and stop mongod
 */
export const closeDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
};

/**
 * Remove all the data for all db collections
 */
export const clearDB = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

/**
 * Generate a valid JWT token for testing
 */
export const generateAuthToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || "test-secret-key";
  return jwt.sign({ userId }, secret, { expiresIn: "1h" });
};

/**
 * Generate mock user data
 */
export const mockUser = {
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  password: "Password123!",
  role: "sales" as const,
};

/**
 * Generate mock admin user data
 */
export const mockAdmin = {
  firstName: "Admin",
  lastName: "User",
  email: "admin@example.com",
  password: "AdminPass123!",
  role: "admin" as const,
};

/**
 * Generate mock customer data
 */
export const mockCustomer = {
  firstName: "Test",
  lastName: "Customer",
  email: "customer@example.com",
  phone: "+91-9876543210",
  company: "Test Company",
  address: {
    street: "123 Test Street",
    city: "Test City",
    state: "Test State",
    zipCode: "123456",
    country: "India",
  },
  status: "active" as const,
  source: "website" as const,
  tags: ["test", "sample"],
};

/**
 * Generate mock lead data
 */
export const mockLead = {
  firstName: "Test",
  lastName: "Lead",
  email: "lead@example.com",
  phone: "+91-9876543210",
  company: "Lead Company",
  source: "website" as const,
  status: "new" as const,
  score: 75,
  estimatedValue: 25000,
  notes: "Test lead notes",
};

/**
 * Generate mock deal data
 */
export const mockDeal = (customerId?: string) => ({
  title: "Test Deal",
  value: 50000,
  stage: "prospecting" as const,
  probability: 25,
  expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  customer: customerId || new mongoose.Types.ObjectId().toString(),
  description: "Test deal description",
  tags: ["test"],
});

/**
 * Generate mock activity data
 */
export const mockActivity = (
  relatedTo?: string,
  relatedToModel?: "Customer" | "Lead" | "Deal"
) => ({
  type: "call" as const,
  subject: "Test Call",
  description: "Test activity description",
  relatedTo: relatedTo || new mongoose.Types.ObjectId().toString(),
  relatedToModel: relatedToModel || "Customer",
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  status: "pending" as const,
  priority: "medium" as const,
});

/**
 * Wait for a specified time (useful for testing time-dependent features)
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Create a test user and return auth token
 */
export const createTestUser = async (User: any, userData = mockUser) => {
  const user = await User.create(userData);
  const token = generateAuthToken(user._id.toString());
  return { user, token };
};

/**
 * Create multiple test resources
 */
export const createMultipleResources = async <T>(
  Model: any,
  data: Partial<T>[],
  userId?: string
): Promise<T[]> => {
  const resources = await Promise.all(
    data.map((item) => {
      const resourceData = userId ? { ...item, assignedTo: userId } : item;
      return Model.create(resourceData);
    })
  );
  return resources;
};
