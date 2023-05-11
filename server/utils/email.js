const nodemailer = require('nodemailer');

exports.sendMail = async (email, url) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SEND_BLUE_HOST,
    port: process.env.SEND_BLUE_PORT,
    auth: {
      user: process.env.SEND_BLUE_EMAIL_USERNAME,
      pass: process.env.SEND_BLUE_EMAIL_PASSWORD,
    },
    from: process.env.SEND_BLUE_EMAIL_USERNAME,
  });

  const html = `<p style="margin: 15px 0 0 15px;">Please reset your Book Nook password with this link <a href=${url}>reset password.</a> If you did not request to reset your password please ignore this message. Thank you.</p>`;

  const mailOptions = {
    from: process.env.SEND_BLUE_EMAIL_USERNAME,
    to: email,
    subject: 'Reset Book Nook Password',
    html,
  };

  await transporter.sendMail(mailOptions);
};
