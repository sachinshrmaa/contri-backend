import { getUserActivities } from "../repository/activity.repository.js";

const listUserActivities = async (req, res) => {
  const userId = req.user.user_id;
  if (!userId) {
    return res.status(400).json({ message: "Unauthorized! Please login." });
  }

  try {
    const activities = await getUserActivities(userId);
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { listUserActivities };
