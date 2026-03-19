import History from "../models/History.model.js";

export const createHistoryEntry = (data) => History.create(data);

export const getUserHistory = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [entries, total] = await Promise.all([
    History.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    History.countDocuments({ userId })
  ]);
  return { entries, totalEntries: total, totalPages: Math.ceil(total / limit), currentPage: page };
};

export const getHistoryById    = (id, userId) => History.findOne({ _id: id, userId });
export const deleteHistoryById = (id, userId) => History.findOneAndDelete({ _id: id, userId });
export const clearUserHistory  = (userId)     => History.deleteMany({ userId });