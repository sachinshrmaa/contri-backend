import { getPool } from "../db/postgres.js";

export const createGroup = async (groupData) => {
  const query =
    "INSERT INTO Groups (name, type, created_by) VALUES ($1, $2, $3)";

  const values = [groupData.name, groupData.type, groupData.userId];

  const { rows } = await getPool().query(query, values);
  return rows[0];
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
    "insert into usersgroupsmapping (user_id, group_id) values($1, $2);";

  const values = [userId, groupId];

  const { rows } = await getPool().query(query, values);
  return rows[0];
};

// @todo
// add exisiting users check while adding users to the usersgroupsmapping table
// add created_by users to the usersgroupsmapping table when a table is created
