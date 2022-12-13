const nodemailer = require("nodemailer");
const mustache = require("mustache");
const fs = require("fs");
const path = require("path");

// const { promisify } = require("util");
const accessToken = require("../config/gmail");
require("dotenv").config();

const sendEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      pass: process.env.MAIL_PASS,
      user: process.env.MAIL_USERNAME,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN_OAUTH,
      accessToken,
    },
  });

  // const readFile = promisify(fs.readFile);
  const filePath = path.join(
    __dirname,
    `../../src/templates/email/${data.template}`
  );

  const fileTemplate = fs.readFileSync(filePath, "utf8");
  const mailOptions = {
    from: '"vehicle rental" <arkawebdev1@gmail.com>',
    to: data.to,
    subject: data.subject,
    html: mustache.render(fileTemplate, { ...data }),
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
