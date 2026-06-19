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

async function getAllPosts() {
  const { rows } = await pool.query(
    `
    SELECT 
      posts.id AS post_id, 
      posts.content, 
      posts.created_at,
      posts.last_updated,
      users.id AS author_id, 
      users.username AS author_username
    FROM posts
    LEFT JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC;
    `
  );

  return rows;
}

export { getDemoAdmin, getDemoMember, getAllPosts };
