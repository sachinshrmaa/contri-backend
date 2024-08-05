import {
  addUserToGroup,
  createGroup,
  getGroupsByUser,
} from "../repository/groups.repository.js";

const createExpenseGroup = async (req, res) => {
  const userId = req.user.user_id;
  if (!userId) {
    return res.status(400).json({ message: "Unauthorized! Please login." });
  }

  const { name, type } = req.body;
  if (!name || !type) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const groupData = {
    name,
    type,
    userId,
  };

  try {
    const group = await createGroup(groupData);
    res.status(201).json({ message: "Group created sucessfully", group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listUserGroups = async (req, res) => {
  const userId = req.user.user_id;
  if (!userId) {
    return res.status(400).json({ message: "Unauthorized! Please login." });
  }

  try {
    const groups = await getGroupsByUser(userId);
    res.status(200).json({ message: "Users groups", groups: groups });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const inviteUserToGroup = async (req, res) => {
  const userId = req.user.user_id;
  if (!userId) {
    return res.status(400).json({ message: "Unauthorized! Please login." });
  }

  const groupId = req.params.id;
  if (!groupId) {
    return res.status(400).json({ message: "Invalid Group ID." });
  }

  try {
    const group = await addUserToGroup(userId, groupId);
    res
      .status(200)
      .json({ message: "User successfully added to the group", group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createExpenseGroup, listUserGroups, inviteUserToGroup };
