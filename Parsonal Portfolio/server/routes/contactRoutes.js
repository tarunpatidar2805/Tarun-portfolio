const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");
const { notifyUserAndAdmin } = require("../notification"); // Notifications

// POST route for contact form
router.post("/", async (req, res) => {
  try {
    // Save the contact message
    const newMessage = new Contact(req.body);
    await newMessage.save();

    // Send notifications (email + WhatsApp) safely
    try {
      await notifyUserAndAdmin(req.body);
    } catch (notifyErr) {
      console.error("⚠️ Notification error:", notifyErr.message);
      // Notifications failed but we continue
    }

    // Respond to frontend
    res.status(201).json({ message: "Message saved successfully! Notifications sent (if possible)." });
  } catch (err) {
    console.error("❌ Error in contact form route:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

module.exports = router;
