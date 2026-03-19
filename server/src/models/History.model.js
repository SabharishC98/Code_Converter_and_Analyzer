import mongoose from "mongoose";
const historySchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  type:           { type: String, enum: ["translate","analyze","optimize","explain"], required: true },
  inputCode:      { type: String, required: true },
  sourceLanguage: { type: String, required: true },
  targetLanguage: { type: String },
  output:         { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });
export default mongoose.model("History", historySchema);