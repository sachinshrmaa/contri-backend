import { getPool, getClient } from "../db/postgres.js";

export const createGroup = async (groupData) => {
  const client = await getClient();

  try {
    // Begin Transaction
    client.query("BEGIN");
    let query =
      "INSERT INTO groups (group_id, name, type, created_by) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [
      groupData.groupId,
      groupData.name,
      groupData.type,
      groupData.userId,
    ];

    const group = await client.query(query, values);

    // add admin as the group member
    let data = [groupData.userId, group.rows[0].group_id];
    let groupAdminQuery = `INSERT INTO usersgroupsmapping (user_id, group_id) values ($1, $2)`;

    await client.query(groupAdminQuery, data);

    // Commit the transaction
    client.query("COMMIT");
  } catch (error) {
    // If any error occurs, rollback the transaction
    client.query("ROLLBACK");
    console.log("Failed to create a Group", error);
    throw new Error(error.message);
  } finally {
    client.release();
  }
};

export const getGroupsByUser = async (userId) => {
  const query =
    "select g.group_id, g.name, g.type, g.created_by, g.created_at from usersgroupsmapping u join groups g on u.group_id = g.group_id where u.user_id =$1";

  const values = [userId];

  const { rows } = await getPool().query(query, values);
  return rows;
};

export const addUserToGroup = async (userId, groupId) => {
  const query =
    "INSERT INTO UsersGroupsMapping (user_id, group_id) VALUES ($1, $2) ON CONFLICT (user_id, group_id) DO NOTHING RETURNING *;";

  const values = [userId, groupId];

  const { rows } = await getPool().query(query, values);
  return rows[0];
};

export const getGroupMembers = async (groupId) => {
  const query = `select u.user_id, u.name, u.email from usersgroupsmapping ugm join users u on ugm.user_id = u.user_id where ugm.group_id =$1`;

  const values = [groupId];

  const { rows } = await getPool().query(query, values);
  return rows;
};

export const removeUserFromGroup = async (userId, groupId) => {
  const query = `DELETE FROM usersgroupsmapping WHERE user_id = $1 AND group_id = $2`;

  const values = [userId, groupId];

  const { rows } = await getPool().query(query, values);
  return rows;
};

export const updateGroupDetails = async (groupData) => {
  const query = `UPDATE "groups" SET name=$1, type=$2 WHERE group_id = $3 RETURNING *`;
  const values = [groupData.name, groupData.type, groupData.groupId];

  const { rows } = await getPool().query(query, values);
  return rows;
};
