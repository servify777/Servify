import mongoose from "mongoose";

const FinalizedBidSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "OngoingProject", required: true },
  projectName: { type: String, required: true },
  budget: { type: Number, required: true },
  winner: { type: String, required: true }, // Email or username of winner
  finalBidAmount: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now },
});

const FB = mongoose.model("FB", FinalizedBidSchema);

export {FB};