#! usr/bin/env node

import { Client } from "pg";

async function main() {
  const dbUrl = process.argv[2] || process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error("Error: No database URL provided.");
    process.exit(1);
  }

  if (dbUrl.includes("koyeb") && !process.argv.includes("--force")) {
    console.error(
      "⚠️  This looks like a production URL. Add --force to confirm."
    );
    process.exit(1);
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("🔌 Connecting to database...");
    await client.connect();

    console.log("🗑️  Dropping all tables...");
    await client.query(`
      DROP TABLE IF EXISTS "session" CASCADE;
      DROP TABLE IF EXISTS "referral_codes" CASCADE;
      DROP TABLE IF EXISTS "posts" CASCADE;
      DROP TABLE IF EXISTS "users" CASCADE;
      DROP FUNCTION IF EXISTS protect_demo_users() CASCADE;
      DROP FUNCTION IF EXISTS limit_demo_posts() CASCADE;
    `);

    console.log("✅ All tables and functions dropped.");
  } catch (error) {
    console.error("❌ Error dropping tables:", error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log("🔌 Database connection closed.");
  }
}

main();
