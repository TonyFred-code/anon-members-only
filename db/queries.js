import pool from "./pool.js";

async function getDemoAdmin() {
  const { rows } = await pool.query(
    `
    SELECT id, email, is_member,is_admin, is_demo, username 
    FROM users WHERE is_demo = true AND is_admin = true LIMIT 1;
    `
  );
  return rows[0];
}

async function getDemoMember() {
  const { rows } = await pool.query(
    `
    SELECT id, email, is_member,is_admin, is_demo, username 
    FROM users WHERE is_demo = true AND is_admin = false AND is_member = true LIMIT 1;
    `
  );
  return rows[0];
}

export { getDemoAdmin, getDemoMember };
