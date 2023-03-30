const nodemailer = require("nodemailer");

exports.sendMail = async (email, url) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const html = `<p>please reset your password with this link <a href=${url}>reset password</a></p>`;

  const mailOptions = {
    from: "test@test.com",
    to: email,
    subject: "forgot password",
    html,
  };

  await transporter.sendMail(mailOptions);
};
