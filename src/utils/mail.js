const nodemailer = require("nodemailer");
const fs = require("fs");
const mustache = require("mustache");
const gmail = require("../config/gmail");

module.exports = {
  sendMail: (data) => {
    // eslint-disable-next-line no-new
    new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
          type: "OAuth2",
          user: process.env.MAIL_USERNAME,
          clientId: gmail.clientId,
          clientSecret: gmail.clientSecret,
          refreshToken: gmail.refreshToken,
        },
      });

      const fileTemplate = fs.readFileSync(
        `src/templates/email/${data.template}`,
        "utf8"
      );

      const mailOptions = {
        from: '"Event Organizing" <arkawebdev1@gmail.com>',
        to: data.to,
        subject: data.subject,
        html: mustache.render(fileTemplate, { ...data }),
      };

      transporter.sendMail(mailOptions, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  },
};
