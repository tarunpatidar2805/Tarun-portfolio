const nodemailer = require("nodemailer");
const twilio = require("twilio");
require("dotenv").config();

const adminEmail = process.env.ADMIN_EMAIL;
const adminWhatsapp = process.env.ADMIN_WHATSAPP;

// ===== Nodemailer Setup =====
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // Gmail App Password होना चाहिए
  },
});

// ===== Twilio Setup =====
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioWhatsappFrom = process.env.TWILIO_WHATSAPP_FROM;

// ===== Send Email =====
async function sendMail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Mail sent to ${to}`);
  } catch (err) {
    console.error(`⚠️ Mail error to ${to}:`, err.message);
  }
}

// ===== Send WhatsApp =====
async function sendWhatsapp(to, message) {
  try {
    await twilioClient.messages.create({
      from: `whatsapp:${twilioWhatsappFrom}`,
      to: `whatsapp:${to}`,
      body: message,
    });
    console.log(`✅ WhatsApp sent to ${to}`);
  } catch (err) {
    console.error(`⚠️ WhatsApp error to ${to}:`, err.message);
  }
}

// ===== Main Notification Function =====
async function notifyUserAndAdmin(data) {
  const userMsg = `👋 Hello ${data.name},\n\n✅ Thanks for contacting us!\nWe have received your details and will get back to you soon.`;
  
  const adminMsg = `
📌 New Contact Submission:
- Name: ${data.name}
- Email: ${data.email}
- WhatsApp: ${data.whatsapp}
- Education: ${data.education || "N/A"}
- Profession: ${data.profession || "N/A"}
- Other: ${data.other || "N/A"}
- Description: ${data.description || "N/A"}
  `;

  // Send Emails (errors logged individually)
  await sendMail(data.email, "✅ Contact Form Received", `<p>${userMsg.replace(/\n/g, "<br>")}</p>`);
  await sendMail(adminEmail, "📩 New Contact Submission", `<pre>${adminMsg}</pre>`);

  // Send WhatsApp messages safely
  try { await sendWhatsapp(data.whatsapp, userMsg); } catch (err) { console.error(err); }
  try { await sendWhatsapp(adminWhatsapp, adminMsg); } catch (err) { console.error(err); }
}

module.exports = { notifyUserAndAdmin };
