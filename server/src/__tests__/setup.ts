import { connectDB, closeDB, clearDB } from "./helpers/testUtils";

// Set test environment variables
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-key-for-testing-only";
process.env.JWT_EXPIRY = "1h";

// Connect to a new in-memory database before running any tests
beforeAll(async () => {
  await connectDB();
}, 60000); // 60 second timeout for MongoDB Memory Server startup

// Clear all test data after every test
afterEach(async () => {
  await clearDB();
});

// Remove and close the database and server after all tests
afterAll(async () => {
  await closeDB();
}, 60000);

// Suppress console logs during tests (optional - remove if you want to see logs)
global.console = {
  ...console,
  log: jest.fn(), // Suppress console.log
  debug: jest.fn(), // Suppress console.debug
  info: jest.fn(), // Suppress console.info
  // Keep error and warn for debugging
  error: console.error,
  warn: console.warn,
};
