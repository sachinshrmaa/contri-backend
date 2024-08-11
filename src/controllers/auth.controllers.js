import bycrypt from "bcryptjs";
import { nanoid } from "nanoid";
import {
  createUser,
  deactivateUserProfile,
  getUserByEmail,
} from "../repository/auth.repository.js";
import { generateToken } from "../utils/auth.utils.js";

const SignUp = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const userData = {
    userId: nanoid(),
    name,
    email,
    password,
  };

  userData.password = bycrypt.hashSync(password, 10);

  try {
    if (await getUserByEmail(email))
      return res.status(400).json({ message: "User already exists" });

    const user = await createUser(userData);

    res.status(201).json({ message: "User registered sucessfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const LogIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let user;
  try {
    user = await getUserByEmail(email);
  } catch (error) {
    console.log("Failed to fetch user:", error);
    return res.status(500).json({ message: error.message });
  }

  if (user === null) {
    return res.status(400).json({ message: "User does not exists" });
  }

  if (user.is_active === false) {
    return res.status(400).json({ message: "User is not active" });
  }

  if (!bycrypt.compareSync(password, user.password)) {
    return res.status(400).json({ message: "Invalid credentials" });
  } else {
    const token = generateToken({ userId: user.user_id });
    res.cookie("accessToken", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      origin: "localhost",
    });

    user.password = undefined;
    return res.status(200).json({ message: "Logged in successfully", user });
  }
};

const LogOut = async (req, res) => {
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Logged out successfully" });
};

const deactivateUserAccount = async (req, res) => {
  const userId = req.user.user_id;
  if (!userId) {
    return res.status(400).json({ message: "Please login." });
  }

  try {
    await deactivateUserProfile(userId);
    res.status(200).json({ message: "User deactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { SignUp, LogIn, LogOut, deactivateUserAccount };
