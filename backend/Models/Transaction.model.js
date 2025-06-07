import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [0, "Amount must be at least 0"], // Set minimum value with a custom error message
  },
  status: {
    type: String,
    required: true,
    enum: ["PENDING", "COMPLETE", "FAILED", "REFUNDED"], // Example statuses
    default: "PENDING",
  },
});

export const Transaction = mongoose.model("Transaction", transactionSchema);