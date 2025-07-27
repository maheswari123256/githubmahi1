// utils/sendMail.js
const nodemailer = require("nodemailer");

const sendMail = async (to, subject, text) => {
  try {
    if (process.env.MAIL_ENABLED !== "true") {
      console.log("📭 MAIL_DISABLED: Mail not sent to", to);
      return;
    }

    let transporter;

    // ✅ For student testing – fallback to Ethereal
    if (process.env.MAIL_USER === "ethereal") {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      const info = await transporter.sendMail({
        from: `"Food App (Test)" <no-reply@ethereal.com>`,
        to,
        subject,
        text,
      });

      console.log(`✅ Ethereal mail sent → ${nodemailer.getTestMessageUrl(info)}`);
      return;
    }

    // ✅ For Gmail (production-ready)
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.MAIL_USER,
      to,
      subject,
      text,
    });

    console.log(`✅ Gmail sent to ${to}`);
  } catch (err) {
    console.log("⚠️ Mail failed but app not affected →", err.message);
  }
};

module.exports = sendMail;
