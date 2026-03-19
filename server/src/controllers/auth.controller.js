import * as authService from "../services/auth.service.js";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: "All fields required." });
    const result = await authService.register(name, email, password);
    res.status(201).json({ success: true, data: result });
  } catch (err) { err.status ? res.status(err.statusCode).json({ success: false, message: err.message }) : next(err); }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required." });
    const result = await authService.emailLogin(email, password);
    res.json({ success: true, data: result });
  } catch (err) { err.statusCode ? res.status(err.statusCode).json({ success: false, message: err.message }) : next(err); }
};

export const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ success: false, message: "Google credential required." });
    const result = await authService.googleLogin(credential);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserProfile(req.user._id);
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

export const logout = (req, res) => res.json({ success: true, data: { message: "Logged out successfully" } });