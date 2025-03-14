const mongoose = require("mongoose");

const kursSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    davomiyligi: { type: String, required: true },
    narxi: { type: Number, min: 0, required: true },
    status: {
      type: String,
      enum: {
        values: ["active", "pending"],
        message: "status faqat 'active', yoki 'pending' bo'lishi mumkin",
      },
      default: "pending",
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    talabalar: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Kurslar", kursSchema);
