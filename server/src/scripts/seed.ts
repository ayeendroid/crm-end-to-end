import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Customer } from "../models/Customer";
import { User } from "../models/User";
import { Lead } from "../models/Lead";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/bharatnet-crm";

// Indian names for realistic data
const firstNames = [
  "Rahul",
  "Priya",
  "Amit",
  "Sneha",
  "Vikas",
  "Anjali",
  "Raj",
  "Pooja",
  "Arjun",
  "Kavya",
  "Aditya",
  "Neha",
  "Rohan",
  "Divya",
  "Karan",
  "Riya",
  "Sanjay",
  "Meera",
  "Ajay",
  "Swati",
  "Vikram",
  "Ananya",
  "Nitin",
  "Shreya",
  "Harsh",
  "Nisha",
  "Suresh",
  "Tanvi",
  "Ramesh",
  "Preeti",
  "Manoj",
  "Sakshi",
  "Ashok",
  "Pallavi",
  "Deepak",
  "Isha",
  "Rajesh",
  "Sonia",
  "Naveen",
  "Kritika",
  "Gaurav",
  "Simran",
  "Arun",
  "Megha",
  "Sandeep",
  "Ritika",
  "Praveen",
  "Aditi",
];

const lastNames = [
  "Sharma",
  "Kumar",
  "Singh",
  "Patel",
  "Verma",
  "Gupta",
  "Reddy",
  "Rao",
  "Joshi",
  "Mehta",
  "Nair",
  "Iyer",
  "Kapoor",
  "Chopra",
  "Agarwal",
  "Jain",
  "Shah",
  "Malhotra",
  "Khanna",
  "Sinha",
  "Bose",
  "Ghosh",
  "Desai",
  "Kulkarni",
];

// Uttarakhand cities
const cities = [
  { city: "Dehradun", state: "Uttarakhand", pincode: "248001" },
  { city: "Haridwar", state: "Uttarakhand", pincode: "249401" },
  { city: "Rishikesh", state: "Uttarakhand", pincode: "249201" },
  { city: "Roorkee", state: "Uttarakhand", pincode: "247667" },
  { city: "Haldwani", state: "Uttarakhand", pincode: "263139" },
  { city: "Rudrapur", state: "Uttarakhand", pincode: "263153" },
  { city: "Kashipur", state: "Uttarakhand", pincode: "244713" },
  { city: "Kotdwar", state: "Uttarakhand", pincode: "246149" },
  { city: "Nainital", state: "Uttarakhand", pincode: "263001" },
  { city: "Almora", state: "Uttarakhand", pincode: "263601" },
];

// Indian companies
const companies = [
  "Tech Solutions Pvt Ltd",
  "InfoSys India",
  "Digital Services Inc",
  "Smart Systems",
  "Cloud Computing Co",
  "Web Innovations",
  "Mobile Apps Studio",
  "Data Analytics Corp",
  "AI Solutions",
  "Cyber Security Services",
  "Software Development House",
  "IT Consultants",
  "E-commerce Platform",
  "Digital Marketing Agency",
  "Content Creators",
  "Education Technology",
  "Healthcare Systems",
  "Finance Tech",
];

// ISP Plans
const planTypes = ["Fiber", "Broadband", "Wireless"];
const planSpeeds = ["50Mbps", "100Mbps", "200Mbps", "500Mbps", "1Gbps"];
const billingCycles = ["Monthly", "Quarterly", "Annual"];

// OTT Apps
const ottApps = [
  "Netflix",
  "Prime Video",
  "Disney+ Hotstar",
  "Zee5",
  "SonyLIV",
  "Voot",
  "MX Player",
  "Alt Balaji",
  "Eros Now",
  "Sun NXT",
];

// Random helper functions
const randomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number) =>
  Math.random() * (max - min) + min;
const randomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// Generate random phone number
const generatePhone = () => {
  const prefix = "+91";
  const number = Math.floor(6000000000 + Math.random() * 3999999999);
  return `${prefix} ${number.toString().slice(0, 5)} ${number
    .toString()
    .slice(5)}`;
};

// Generate random email
const generateEmail = (
  firstName: string,
  lastName: string,
  domain?: string
) => {
  const domains = domain
    ? [domain]
    : ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${randomItem(
    domains
  )}`;
};

// Generate customers
const generateCustomers = (
  count: number,
  adminUserId: mongoose.Types.ObjectId
) => {
  const customers = [];

  for (let i = 0; i < count; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const location = randomItem(cities);
    const company = Math.random() > 0.3 ? randomItem(companies) : undefined;

    const customer = {
      firstName,
      lastName,
      email: generateEmail(firstName, lastName),
      phone: generatePhone(),
      company,
      jobTitle: company
        ? randomItem(["CEO", "CTO", "Manager", "Director", "Owner"])
        : undefined,
      industry: company
        ? randomItem(["IT", "Education", "Healthcare", "Finance", "Retail"])
        : undefined,
      address: {
        street: `${randomInt(1, 500)} ${randomItem([
          "Main",
          "Market",
          "Gandhi",
          "Nehru",
          "MG",
        ])} Road`,
        city: location.city,
        state: location.state,
        zipCode: location.pincode,
        country: "India",
      },
      tags: [],
      source: randomItem(["website", "referral", "social", "phone", "event"]),
      status: randomItem(["active", "inactive", "prospect"]),
      assignedTo: adminUserId,
      lastContactDate: randomDate(new Date(2024, 0, 1), new Date()),
      nextFollowUp: randomDate(new Date(), new Date(2025, 11, 31)),
      totalValue: randomFloat(5000, 500000),
      notes: `Customer from ${location.city}. ${
        company ? `Works at ${company}.` : "Individual customer."
      }`,
      customFields: new Map(),
      createdAt: randomDate(new Date(2023, 0, 1), new Date()),
      // ISP Data
      ispData: {
        plan: {
          type: randomItem(["Fiber", "Broadband", "Wireless"]),
          speed: randomItem([
            "50Mbps",
            "100Mbps",
            "200Mbps",
            "500Mbps",
            "1Gbps",
          ]),
          price: randomInt(500, 3000),
          billingCycle: randomItem(["Monthly", "Quarterly", "Annual"]),
          ottApps: randomItem([
            ["Netflix", "Prime Video"],
            ["Hotstar", "SonyLiv", "Zee5"],
            ["Netflix", "Prime Video", "Disney+"],
            ["YouTube Premium", "Spotify"],
          ]),
          liveChannels: randomInt(50, 300),
        },
        usage: {
          dataConsumed: randomFloat(100, 1000),
          averageSpeed: randomFloat(40, 500),
          uptime: randomFloat(95, 99.9),
          mostUsedOTT: randomItem([
            ["Netflix"],
            ["Prime Video"],
            ["YouTube"],
            ["Hotstar"],
          ]),
          peakUsageHours: randomItem([
            ["20:00-23:00"],
            ["18:00-22:00"],
            ["21:00-00:00"],
          ]),
        },
        customerSince: randomDate(new Date(2020, 0, 1), new Date(2024, 0, 1)),
        lifetimeValue: randomFloat(10000, 100000),
        churnRisk: randomItem(["Low", "Low", "Low", "Medium", "High"]), // More Low than High
        npsScore: randomInt(-20, 90),
        tickets: randomInt(0, 10),
        lastTicketDate:
          Math.random() > 0.5
            ? randomDate(new Date(2024, 0, 1), new Date())
            : undefined,
        satisfaction: randomItem([3, 4, 4, 5, 5]) as 1 | 2 | 3 | 4 | 5, // Mostly satisfied
        referredBy:
          Math.random() > 0.7
            ? `${randomItem(firstNames)} ${randomItem(lastNames)}`
            : undefined,
        nextBillingDate: randomDate(new Date(), new Date(2025, 11, 31)),
        outstandingAmount: Math.random() > 0.8 ? randomFloat(0, 5000) : 0,
      },
    };

    customers.push(customer);
  }

  return customers;
};

// Generate leads
const generateLeads = (count: number, adminUserId: mongoose.Types.ObjectId) => {
  const leads = [];

  for (let i = 0; i < count; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const location = randomItem(cities);
    const company = Math.random() > 0.5 ? randomItem(companies) : undefined;

    const lead = {
      firstName,
      lastName,
      email: generateEmail(firstName, lastName),
      phone: generatePhone(),
      company,
      jobTitle: company
        ? randomItem(["Manager", "Director", "Executive"])
        : undefined,
      address: {
        city: location.city,
        state: location.state,
        zipCode: location.pincode,
        country: "India",
      },
      source: randomItem(["website", "referral", "social", "email", "phone"]),
      status: randomItem([
        "new",
        "contacted",
        "qualified",
        "proposal",
        "negotiation",
        "closed-won",
        "closed-lost",
      ]),
      score: randomInt(1, 100),
      assignedTo: adminUserId,
      notes: `Lead from ${location.city}. Interested in ${randomItem(
        planTypes
      )} connection.`,
      createdAt: randomDate(new Date(2024, 0, 1), new Date()),
    };

    leads.push(lead);
  }

  return leads;
};

// Main seed function
async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await Customer.deleteMany({});
    await User.deleteMany({});
    await Lead.deleteMany({});
    console.log("✅ Existing data cleared");

    // Create admin user
    console.log("👤 Creating admin user...");
    const hashedPassword = await bcrypt.hash("Admin@1234", 12);
    const adminUser = await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@bharatnet.com",
      password: hashedPassword,
      role: "admin",
      department: "Management",
      phone: "+91 98765 00000",
      createdAt: new Date(),
    });
    console.log("✅ Admin user created:");
    console.log(`   Email: admin@bharatnet.com`);
    console.log(`   Password: Admin@1234`);

    // Create sales user
    console.log("👤 Creating sales user...");
    const salesPassword = await bcrypt.hash("Sales@1234", 12);
    const salesUser = await User.create({
      firstName: "Rajesh",
      lastName: "Kumar",
      email: "sales@bharatnet.com",
      password: salesPassword,
      role: "sales",
      department: "Sales",
      phone: "+91 98765 11111",
      createdAt: new Date(),
    });
    console.log("✅ Sales user created:");
    console.log(`   Email: sales@bharatnet.com`);
    console.log(`   Password: Sales@1234`);

    // Generate and insert customers
    console.log("👥 Generating 500 customers...");
    const customers = generateCustomers(500, adminUser._id);
    await Customer.insertMany(customers);
    console.log(`✅ ${customers.length} customers created`);

    // Generate and insert leads
    console.log("📋 Generating 100 leads...");
    const leads = generateLeads(100, adminUser._id);
    await Lead.insertMany(leads);
    console.log(`✅ ${leads.length} leads created`);

    // Summary
    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Users: 2`);
    console.log(`   - Customers: ${customers.length}`);
    console.log(`   - Leads: ${leads.length}`);
    console.log(`   - Total records: ${2 + customers.length + leads.length}`);

    console.log("\n🔐 Login Credentials:");
    console.log("   Admin:");
    console.log("     Email: admin@bharatnet.com");
    console.log("     Password: Admin@1234");
    console.log("   Sales:");
    console.log("     Email: sales@bharatnet.com");
    console.log("     Password: Sales@1234");

    console.log("\n✨ You can now start the server and login!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");
    process.exit(0);
  }
}

// Run seed
seed();
