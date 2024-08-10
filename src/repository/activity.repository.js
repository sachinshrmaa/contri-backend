import { getPool } from "../db/postgres.js";

export const getUserActivities = async (userId) => {
  const query = `
    SELECT 
        e.expense_id, 
        u.name AS paid_by_name,  
        e.title, 
        e.amount, 
        g.name AS group_name,
        e.created_at
    FROM Expenses e JOIN Groups g ON e.group_id = g.group_id
    JOIN Users u ON e.paid_by = u.user_id  
    WHERE e.group_id IN (
            SELECT g.group_id
            FROM Groups g
            JOIN UsersGroupsMapping ugm ON g.group_id = ugm.group_id
            WHERE ugm.user_id = $1  
        )`;
  const { rows } = await getPool().query(query, [userId]);
  return rows;
};
