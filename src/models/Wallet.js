// models/Wallet.js
const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  balance: { type: Number, default: 0 },
  transactions: [
    {
      type: {
        type: String,
        enum: ["deposit", "withdrawal"],
        required: true,
      },
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});

export const Wallet = mongoose.model("Wallet", WalletSchema);
