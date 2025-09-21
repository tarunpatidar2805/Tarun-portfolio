const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    education: {
      type: String,
      enum: ["High School", "Graduation", "Post Graduation", "PhD"],
      default: "Graduation",
    },
    profession: {
      type: String,
      enum: ["Student", "Developer", "Designer", "Other"],
      default: "Student",
    },
    other: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    whatsapp: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
