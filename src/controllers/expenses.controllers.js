import {
  addExpenseToGroup,
  updateGroupBalances,
} from "../repository/expenses.repository.js";

const addGroupExpense = async (req, res) => {
  const { title, amount, splitRatio, paidBy, groupId } = req.body;

  const expenseData = {
    title,
    amount,
    splitRatio,
    paidBy,
    groupId,
  };

  try {
    // Step 1: Insert the expense
    const expenseId = await addExpenseToGroup(expenseData);
    console.log("expenseid", expenseId);

    // Step 2: Update the group_balance table for all members
    await updateGroupBalances(expenseData);

    res
      .status(200)
      .json({ message: "Expense added and balances updated", expenseId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { addGroupExpense };
