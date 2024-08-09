import { nanoid } from "nanoid";
import {
  addExpenseToGroup,
  getBalanceByGroup,
  getGroupExpenses,
  updateGroupBalances,
} from "../repository/expenses.repository.js";

const addGroupExpense = async (req, res) => {
  const { title, amount, splitRatio, groupId } = req.body;
  if (!title || !amount || !splitRatio || !groupId) {
    return res.status(400).json({ message: "Unauthorized! Please login." });
  }

  const paidBy = req.user.user_id;
  if (!paidBy) {
    return res.status(400).json({ message: "Unauthorized! Please login." });
  }

  const expenseData = {
    expenseId: nanoid(),
    title,
    amount,
    splitRatio,
    paidBy,
    groupId,
  };

  try {
    // Step 1: Insert the expense
    const expenseId = await addExpenseToGroup(expenseData);

    // Step 2: Update the group_balance table for all members
    await updateGroupBalances(expenseData);

    res
      .status(200)
      .json({ message: "Expense added and balances updated", expenseId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGroupMembersBalance = async (req, res) => {
  const { groupId } = req.body;
  if (!groupId) {
    return res.status(400).json({ message: "Group Id is required." });
  }

  const userId = req.user.user_id;
  if (!userId) {
    return res.status(400).json({ message: "Unauthorized! Please login." });
  }

  try {
    const expenses = await getBalanceByGroup(groupId, userId);
    res.status(200).json({ expenses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listGroupExpenses = async (req, res) => {
  const { groupId } = req.body;
  if (!groupId) {
    return res.status(400).json({ message: "Group Id is required." });
  }

  try {
    const expenses = await getGroupExpenses(groupId);
    res.status(200).json({ expenses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { addGroupExpense, getGroupMembersBalance, listGroupExpenses };
