#! usr/bin/env node

import { Client } from "pg";
import bcrypt from "bcrypt";

const saltRounds = 10;

async function main() {
  const dbUrl = process.argv[2] || process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error("Error: No database URL provided.");
    console.error("\nUsage:");
    console.error("  node db/populatedb.js <database-url>");
    console.error("  npm run db:setup");
    console.error("\nOr set DATABASE_URL in your .env file");
    process.exit(1);
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("🔌 Connecting to database...");
    await client.connect();

    console.log("📊 Creating tables...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" varchar UNIQUE NOT NULL,
        "username" varchar UNIQUE NOT NULL,
        "password" varchar NOT NULL,
        "is_member" boolean DEFAULT false,
        "is_admin" boolean DEFAULT false,
        "is_demo" boolean DEFAULT false,
        "created_at" timestamp DEFAULT (NOW())
      );

      CREATE TABLE IF NOT EXISTS "posts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "content" varchar(255),
        "created_at" timestamp DEFAULT (NOW()),
        "last_updated" timestamp DEFAULT (NOW()),
        "user_id" uuid
      );

      CREATE TABLE IF NOT EXISTS "referral_codes" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "code" varchar(8) UNIQUE NOT NULL,
        "admin_id" uuid,
        "uses" integer DEFAULT 0,
        "max_uses" integer DEFAULT 5,
        "valid" boolean DEFAULT true,
        "created_at" timestamp DEFAULT (NOW())
      );

     ALTER TABLE "posts" DROP CONSTRAINT IF EXISTS posts_user_id_fkey;
     ALTER TABLE "posts" ADD FOREIGN KEY ("user_id") 
     REFERENCES "users" ("id") 
     ON DELETE CASCADE
     DEFERRABLE INITIALLY IMMEDIATE;

    ALTER TABLE "referral_codes" DROP CONSTRAINT IF EXISTS referral_codes_admin_id_fkey;
  ALTER TABLE "referral_codes" ADD FOREIGN KEY ("admin_id") 
  REFERENCES "users" ("id") 
  ON DELETE CASCADE
  DEFERRABLE INITIALLY IMMEDIATE;
    `);

    console.log("🔒 Creating protection triggers...");
    await client.query(`
      CREATE OR REPLACE FUNCTION protect_demo_users()
      RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'DELETE' AND OLD.is_demo THEN
          RAISE EXCEPTION 'Cannot delete demo accounts.';
        END IF;
        IF TG_OP = 'UPDATE' AND OLD.is_demo THEN
          IF NOT NEW.is_demo
            OR NEW.password != OLD.password
            OR NEW.is_member != OLD.is_member
            OR NEW.is_admin != OLD.is_admin
          THEN
            RAISE EXCEPTION 'Cannot modify protected fields on demo accounts.';
          END IF;
        END IF;
        IF TG_OP = 'DELETE' THEN RETURN OLD;
        ELSE RETURN NEW;
        END IF;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS enforce_demo_protection ON users;
      CREATE TRIGGER enforce_demo_protection
      BEFORE UPDATE OR DELETE ON users
      FOR EACH ROW EXECUTE FUNCTION protect_demo_users();

      CREATE OR REPLACE FUNCTION limit_demo_posts()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM users
          WHERE id = NEW.user_id AND is_demo = true
        ) THEN
          RETURN NEW;
        END IF;

        DELETE FROM posts
        WHERE user_id = NEW.user_id
        AND id NOT IN (
          SELECT id FROM posts
          WHERE user_id = NEW.user_id
          ORDER BY created_at DESC
          LIMIT 10
        );
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS enforce_demo_post_limit ON posts;
      CREATE TRIGGER enforce_demo_post_limit
      AFTER INSERT ON posts
      FOR EACH ROW EXECUTE FUNCTION limit_demo_posts();
    `);

    console.log("🌱 Seeding demo and default accounts...");
    const demoAdminPassword = await bcrypt.hash("DemoAdmin1!", saltRounds);
    const demoMemberPassword = await bcrypt.hash("DemoMember1!", saltRounds);
    const regularPassword = await bcrypt.hash("Seeded1234!", saltRounds);

    // Regular Demo seeded user
    const regularUser = await client.query(
      `
      INSERT INTO users (email, username, password, is_demo)
      VALUES ('ghost@anonpost.com', 'Silent-Ghost-4921', $1, true)
      ON CONFLICT (email) DO NOTHING
      RETURNING id;
    `,
      [regularPassword]
    );

    // Demo admin
    const demoAdmin = await client.query(
      `
      INSERT INTO users (email, username, password, is_member, is_admin, is_demo)
      VALUES ('demo.admin@anonpost.com', 'Clever-Fox-0001', $1, true, true, true)
      ON CONFLICT (email) DO NOTHING
      RETURNING id;
    `,
      [demoAdminPassword]
    );

    // Demo member
    const demoMember = await client.query(
      `
      INSERT INTO users (email, username, password, is_member, is_demo)
      VALUES ('demo.member@anonpost.com', 'Swift-River-0002', $1, true, true)
      ON CONFLICT (email) DO NOTHING
      RETURNING id;
    `,
      [demoMemberPassword]
    );

    const regularId =
      regularUser.rows[0]?.id ||
      (
        await client.query(
          `SELECT id FROM users WHERE email = 'ghost@anonpost.com'`
        )
      ).rows[0].id;

    const adminId =
      demoAdmin.rows[0]?.id ||
      (
        await client.query(
          `SELECT id FROM users WHERE email = 'demo.admin@anonpost.com'`
        )
      ).rows[0].id;

    const memberId =
      demoMember.rows[0]?.id ||
      (
        await client.query(
          `SELECT id FROM users WHERE email = 'demo.member@anonpost.com'`
        )
      ).rows[0].id;

    // Referral code for demo admin (high max_uses so reviewers don't exhaust it)
    await client.query(
      `
      INSERT INTO referral_codes (code, admin_id, max_uses)
      VALUES ('ANON-VIP', $1, 999)
      ON CONFLICT (code) DO NOTHING;
    `,
      [adminId]
    );

    // Seeded posts from regular user so feed looks populated
    const seedPosts = [
      "The veil between inside and outside is thinner than you think.",
      "Anonymity is not invisibility. It is freedom.",
      "Every mask reveals something the face conceals.",
      "What would you say if no one knew it was you?",
      "The outside sees shadows. The inside sees faces.",
      "Trust is the price of admission here.",
    ];

    for (let i = 2; i < seedPosts.length; i++) {
      const content = seedPosts[i];

      await client.query(
        `
        INSERT INTO posts (content, user_id)
        VALUES ($1, $2);
      `,
        [content, regularId]
      );
    }

    await client.query(
      `
      INSERT INTO posts (content, user_id)
      VALUES ($1, $2);
    `,
      [seedPosts[0], adminId]
    );
    await client.query(
      `
      INSERT INTO posts (content, user_id)
      VALUES ($1, $2);
    `,
      [seedPosts[1], memberId]
    );

    console.log("✅ Database setup complete!");
    console.log("");
    console.log("📋 Demo account credentials:");
    console.log("   Admin  → demo.admin@anonpost.com  / DemoAdmin1!");
    console.log("   Member → demo.member@anonpost.com / DemoMember1!");
    console.log("   Referral code: ANON-VIP");
    console.log("");
    console.log("🎉 Your clubhouse is ready!");
  } catch (error) {
    console.error("❌ Error setting up database:", error.message);
    console.error("\nFull error:", error);
    process.exit(1);
  } finally {
    await client.end();
    console.log("🔌 Database connection closed.");
  }
}

main();
