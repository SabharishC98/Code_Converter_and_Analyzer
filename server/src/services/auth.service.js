import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import { generateToken } from "../utils/jwt.utils.js";
import { verifyGoogleToken } from "../config/google.config.js";

export const register = async (name, email, password) => {
  const existing = await User.findOne({ email });
  if (existing) { const e = new Error("Email already registered."); e.statusCode = 409; throw e; }
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  return { token: generateToken(user), user: { id: user._id, name, email } };
};

export const emailLogin = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !user.password) { const e = new Error("Invalid email or password."); e.statusCode = 401; throw e; }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) { const e = new Error("Invalid email or password."); e.statusCode = 401; throw e; }
  user.lastLogin = new Date(); await user.save();
  return { token: generateToken(user), user: { id: user._id, name: user.name, email } };
};

export const googleLogin = async (credential) => {
  const g = await verifyGoogleToken(credential);
  
  // Try to find existing user by googleId OR email
  let user = await User.findOne({ 
    $or: [{ googleId: g.googleId }, { email: g.email }] 
  });

  if (user) {
    // Update existing user with Google info
    user.googleId  = g.googleId;
    user.name      = g.name;
    user.picture   = g.picture;
    user.lastLogin = new Date();
    await user.save();
  } else {
    // Create new user
    user = await User.create({
      googleId:  g.googleId,
      email:     g.email,
      name:      g.name,
      picture:   g.picture,
      lastLogin: new Date(),
    });
  }

  return {
    token: generateToken(user),
    user: { id: user._id, name: user.name, email: user.email, picture: user.picture }
  };
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-__v -googleId -password");
  if (!user) throw new Error("User not found");
  return { id: user._id, email: user.email, name: user.name, picture: user.picture };
};