const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ===== Middlewares =====
app.use(cors({
  origin: "*", // अगर सिर्फ specific domain allow करना है तो यहां लिख सकते हो
  methods: ["GET", "POST"],
}));
app.use(express.json());

// ===== Routes =====
const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contact", contactRoutes);

// ===== MongoDB connect =====
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => {
  console.error("❌ MongoDB connection error:", err.message);
  process.exit(1); // अगर connect fail हो तो server बंद कर दो
});

// ===== Default Route =====
app.get("/", (req, res) => {
  res.send("🚀 Portfolio Backend Running...");
});

// ===== Server listen =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
