import { nanoid } from "nanoid";
import {
  addUserToGroup,
  createGroup,
  getGroupDetails,
  getGroupMembers,
  getGroupsByUser,
  removeUserFromGroup,
  updateGroupDetails,
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
    groupId: nanoid(),
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

const listGroupMembers = async (req, res) => {
  const { groupId } = req.body;
  if (!groupId) {
    return res.status(400).json({ message: "Group Id is required." });
  }

  try {
    const members = await getGroupMembers(groupId);
    res.status(200).json({ message: "Group members", members: members });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const leaveExpenseGroup = async (req, res) => {
  const userId = req.user.user_id;
  if (!userId) {
    return res.status(400).json({ message: "Unauthorized! Please login." });
  }

  const { groupId } = req.body;
  if (!groupId) {
    return res.status(400).json({ message: "Group Id is required." });
  }

  try {
    await removeUserFromGroup(userId, groupId);
    res.status(200).json({ message: "User successfully left group members" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editExpenseGroup = async (req, res) => {
  const groupId = req.params.id;
  if (!groupId) {
    return res.status(400).json({ message: "Invalid Group ID." });
  }

  const { name, type } = req.body;
  if (!name || !type) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const groupData = {
    groupId,
    name,
    type,
  };

  try {
    await updateGroupDetails(groupData);
    res.status(200).json({ message: "Group edited successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listGroupDetails = async (req, res) => {
  const { groupId } = req.body;
  if (!groupId) {
    return res.status(400).json({ message: "Group Id is required." });
  }

  try {
    const group = await getGroupDetails(groupId);
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createExpenseGroup,
  listUserGroups,
  inviteUserToGroup,
  listGroupMembers,
  leaveExpenseGroup,
  editExpenseGroup,
  listGroupDetails,
};
