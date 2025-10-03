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
    pass: process.env.GMAIL_PASS, // Gmail App Password
  },
});

// ===== Twilio Setup =====
const twilioClient = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const twilioWhatsappFrom = process.env.TWILIO_WHATSAPP_FROM;

// ===== Send Email =====
async function sendMail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `"Tarun Portfolio" <${process.env.GMAIL_USER}>`,
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
  const {
    name,
    email,
    whatsapp,
    education,
    profession,
    other,
    location,
    pincode,
    description,
  } = data;

  const liveLink = "https://tarun-portfolio.onrender.com";

  // ===== User Email (HTML Template) =====
  const userHtml = `
  <div style="font-family: Arial, sans-serif; color:#333; padding:20px; line-height:1.6;">
    <h2 style="color:#007bff;">Hello ${name}, 👋</h2>
    <p>Thank you for reaching out! I have received your details successfully.</p>

    <h3 style="color:#444;">📘 What I offer:</h3>
    <ul>
      <li><b>Academic Notes</b> – Detailed notes on core CS subjects</li>
      <li><b>Verified Certificates</b> – Proof of my technical expertise</li>
      <li><b>Services</b> – MERN Stack Development & Web Solutions</li>
    </ul>

    <p>👉 You can explore here:</p>
    <p>
      <a href="${liveLink}/notes.html" 
         style="background:#36d1dc; color:#fff; padding:10px 16px; text-decoration:none; border-radius:6px;">
         📘 View Notes
      </a>
      &nbsp;
      <a href="${liveLink}/certificate.html" 
         style="background:#ff512f; color:#fff; padding:10px 16px; text-decoration:none; border-radius:6px;">
         🏆 View Certificates
      </a>
      &nbsp;
      <a href="${liveLink}/services.html" 
         style="background:#007bff; color:#fff; padding:10px 16px; text-decoration:none; border-radius:6px;">
         💼 View Services
      </a>
    </p>

    <hr style="margin:20px 0;">
    <p style="font-size:14px; color:#555;">
      I will connect with you soon via Email/WhatsApp.<br>
      Best regards,<br>
      <b>Tarun Patidar</b><br>
      🚀 Portfolio Website
    </p>
  </div>
  `;

  // ===== Admin Email (Table Format) =====
  const adminHtml = `
  <div style="font-family: Arial, sans-serif; color:#333; padding:20px;">
    <h2 style="color:#ff512f;">📩 New Contact Submission</h2>
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse; width:100%; font-size:14px;">
      <tr><td><b>Name</b></td><td>${name}</td></tr>
      <tr><td><b>Email</b></td><td>${email}</td></tr>
      <tr><td><b>WhatsApp</b></td><td>${whatsapp}</td></tr>
      <tr><td><b>Education</b></td><td>${education || "N/A"}</td></tr>
      <tr><td><b>Profession</b></td><td>${profession || "N/A"}</td></tr>
      <tr><td><b>Other</b></td><td>${other || "N/A"}</td></tr>
      <tr><td><b>Location</b></td><td>${location || "N/A"}</td></tr>
      <tr><td><b>Pincode</b></td><td>${pincode || "N/A"}</td></tr>
      <tr><td><b>Description</b></td><td>${description || "N/A"}</td></tr>
    </table>
  </div>
  `;

  // ===== WhatsApp Messages =====
  const userMsg = `
👋 Hello ${name},

✅ Thanks for contacting Tarun Portfolio!  
I offer:
📘 Academic Notes  
🏆 Verified Certificates  
💼 Web Development Services  

🔗 Explore: ${liveLink}  

I’ll connect with you soon.  
– Tarun
`;

  const adminMsg = `
📌 New Contact Submission:
- Name: ${name}
- Email: ${email}
- WhatsApp: ${whatsapp}
- Education: ${education || "N/A"}
- Profession: ${profession || "N/A"}
- Other: ${other || "N/A"}
- Location: ${location || "N/A"}
- Pincode: ${pincode || "N/A"}
- Description: ${description || "N/A"}
`;

  // ===== Send Emails =====
  await sendMail(email, "✅ Thanks for contacting Tarun Portfolio", userHtml);
  await sendMail(adminEmail, "📩 New Contact Submission", adminHtml);

  // ===== Send WhatsApps =====
  await sendWhatsapp(whatsapp, userMsg);
  await sendWhatsapp(adminWhatsapp, adminMsg);
}

module.exports = { notifyUserAndAdmin };
