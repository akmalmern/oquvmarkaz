const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Kategoriya nomi kiritish majburiy"],
      maxlength: [50, "Kategoriya nomi 50 belgidan oshmasligi kerak"],
    },
    description: {
      type: String,
      maxlength: [200, "Tavsif 200 belgidan oshmasligi kerak"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);
