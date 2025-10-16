const { MongoClient } = require("mongodb");

async function checkEmails() {
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB\n");

    const db = client.db("bharatnet-crm");
    const emails = await db
      .collection("emails")
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    console.log(`📧 Found ${emails.length} emails in database:\n`);

    emails.forEach((email, index) => {
      console.log(`${index + 1}. Email ID: ${email._id}`);
      console.log(`   To: ${email.to.join(", ")}`);
      console.log(`   Subject: ${email.subject}`);
      console.log(`   Type: ${email.type}`);
      console.log(`   Status: ${email.status}`);
      console.log(`   Created: ${email.createdAt}`);
      console.log(`   Customer ID: ${email.customerId || "N/A"}`);
      console.log("");
    });

    if (emails.length === 0) {
      console.log("⚠️  No emails found in database");
      console.log("   This means emails are being sent but not saved to DB");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await client.close();
  }
}

checkEmails();
