import { getPool } from "../db/postgres.js";

export const addExpenseToGroup = async (expenseData) => {
  const query = `INSERT INTO expenses (title, amount, split_ratio, paid_by, group_id) VALUES ($1, $2, $3, $4, $5) RETURNING expense_id
`;
  const values = [
    expenseData.title,
    expenseData.amount,
    expenseData.splitRatio,
    expenseData.paidBy,
    expenseData.groupId,
  ];

  const { rows } = await getPool().query(query, values);
  return rows[0].expense_id;
};

export const calculateIndividualShare = (amount, splitRatio) => {
  return (amount * splitRatio) / 100;
};

export const updateGroupBalances = async (expenseData) => {
  // Get all users in the group
  const query = `SELECT user_id FROM usersgroupsmapping WHERE group_id = $1;`;
  const { rows: users } = await getPool().query(query, [expenseData.groupId]);

  const individualShare = calculateIndividualShare(
    expenseData.amount,
    expenseData.splitRatio
  );

  for (const user of users) {
    const userId = user.user_id;

    // The person who owes
    await getPool().query(
      `UPDATE usersgroupsmapping 
        SET balance = balance - $1 
         WHERE user_id = $2 AND group_id = $3`,
      [individualShare, userId, expenseData.groupId]
    );

    // The person who paid (positive balance means they are owed money)
    await getPool().query(
      `UPDATE usersgroupsmapping 
         SET balance = balance + $1 
         WHERE user_id = $2 AND group_id = $3`,
      [individualShare, expenseData.paidBy, expenseData.groupId]
    );
  }
};

export const getBalanceByGroup = async (groupId, userId) => {
  const query = `select u.name, gb.balance FROM usersgroupsmapping gb JOIN users u ON gb.user_id = u.user_id WHERE gb.group_id = $1 and u.user_id =$2`;
  const { rows } = await getPool().query(query, [groupId, userId]);
  return rows;
};
