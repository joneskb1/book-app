const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// const imageBuffer = fs.readFileSync(`${__dirname}/../public/logo.png`);
// const dataUrl = `data:image/png;base64,${imageBuffer.toString('base64')}`;
// const filePath = `${__dirname}/../public/logo.png`;

const html = fs.readFileSync(
  path.join(__dirname, '../public', 'email.html'),
  'utf8'
);

exports.sendMail = async (email, url) => {
  const transporter = nodemailer.createTransport({
    host: process.env.BREVO_EMAIL_HOST,
    port: process.env.BREVO_EMAIL_PORT,
    auth: {
      user: process.env.BREVO_EMAIL_USERNAME,
      pass: process.env.BREVO_EMAIL_PASSWORD,
    },
    from: process.env.BREVO_EMAIL_USERNAME,
  });

  let newHtml = html.replace('_URL_', url);
  // newHtml = newHtml.replace('_IMG_', dataUrl);

  const mailOptions = {
    from: process.env.BREVO_EMAIL_USERNAME,
    to: email,
    subject: 'Reset Book Nook Password',
    html: newHtml,
    // attachments: [
    //   {
    //     filename: 'logo.png',
    //     path: filePath,
    //     cid: 'logo', //same cid value as in the html img src
    //   },
    // ],
  };

  await transporter.sendMail(mailOptions);
};
