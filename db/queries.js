import pool from "./pool.js";

async function getDemoRegular() {
  const { rows } = await pool.query(
    `
    SELECT id, email, is_demo, is_member, is_admin, username
    FROM users
    WHERE is_demo = true AND is_admin = false AND is_member = false
    LIMIT 1;
    `
  );

  return rows[0];
}

async function getDemoAdmin() {
  const { rows } = await pool.query(
    `
    SELECT id, email, is_member, is_admin, is_demo, username 
    FROM users WHERE is_demo = true AND is_admin = true LIMIT 1;
    `
  );
  return rows[0];
}

async function getDemoMember() {
  const { rows } = await pool.query(
    `
    SELECT id, email, is_member, is_admin, is_demo, username 
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

async function checkEmailExists(email) {
  const { rows } = await pool.query("SELECT id FROM users WHERE email = $1;", [
    email,
  ]);

  return rows.length > 0;
}

async function createNewUser(email, username, password) {
  const { rows } = await pool.query(
    `
      INSERT INTO users (email, password, username)
       VALUES ($1, $2, $3)
       RETURNING id, email, username, is_member, is_admin, is_demo;
      `,
    [email, password, username]
  );

  const user = rows[0];

  return user;
}

// Deliberately includes the password field as it is
// only used by passportJS to compare when logging a user in
// Data never gets saved into session.
async function getUserByEmail(email) {
  const { rows } = await pool.query(
    `
    SELECT id, email, username, password, is_member, is_admin, is_demo
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  const user = rows[0];

  return user;
}

async function getUserById(id) {
  const { rows } = await pool.query(
    "SELECT id, email, username, is_member, is_admin, is_demo FROM users WHERE id = $1;",
    [id]
  );
  const user = rows[0];

  return user;
}

export {
  getDemoAdmin,
  getDemoMember,
  getDemoRegular,
  getAllPosts,
  checkEmailExists,
  createNewUser,
  getUserByEmail,
  getUserById,
};
