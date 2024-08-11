import { getPool } from "../db/postgres.js";

export const getUserByEmail = async (email) => {
  const query = "SELECT * FROM Users WHERE email = $1";
  const values = [email];

  const { rows } = await getPool().query(query, values);
  if (rows.length) {
    return rows[0];
  } else {
    return null;
  }
};

export const getUserById = async (userId) => {
  const query = "SELECT * FROM Users WHERE user_id = $1";
  const values = [userId];

  const { rows } = await getPool().query(query, values);
  if (rows.length) {
    return rows[0];
  } else {
    return null;
  }
};

export const createUser = async (userData) => {
  const query =
    "INSERT INTO Users (user_id, name, email, password) VALUES ($1, $2, $3, $4)";

  const values = [
    userData.userId,
    userData.name,
    userData.email,
    userData.password,
  ];

  const { rows } = await getPool().query(query, values);
  return rows[0];
};

export const deactivateUserProfile = async (userId) => {
  const query = "update users set is_active = false where user_id = $1";
  const { rows } = await getPool().query(query, [userId]);
  return rows[0];
};

export const updateUserProfile = async (userId, userData) => {
  const fields = [];
  const values = [];
  let query = "UPDATE users SET ";

  // Track the parameter index
  let paramIndex = 1;

  // Add provided fields to the query
  if (userData.name) {
    fields.push(`name = $${paramIndex++}`);
    values.push(userData.name);
  }
  if (userData.email) {
    fields.push(`email = $${paramIndex++}`);
    values.push(userData.email);
  }
  if (userData.newPassword) {
    // If updating password, consider hashing it before storing
    fields.push(`password = $${paramIndex++}`);
    values.push(userData.newPassword); // Ensure password is hashed if needed
  }

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  // Join the fields and add the WHERE clause
  query += fields.join(", ") + ` WHERE user_id = $${paramIndex}`;
  values.push(userId);

  const { rows } = await getPool().query(query, values);
  return rows[0];
};
