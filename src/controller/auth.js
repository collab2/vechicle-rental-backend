const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const authModel = require("../models/auth");
const wrapper = require("../utils/wrapper");
const User = require("../models/user");
const client = require("../config/redis");
const { sendEmail } = require("../utils/mail");

module.exports = {
  register: async (request, response) => {
    try {
      const { email, password, role } = request.body;
      // UNTUK PASSWORD BISA DI ENKRIPSI
      const salt = await bcrypt.genSalt(10);
      const encrypted = await bcrypt.hash(password, salt);

      const setData = {
        email,
        password: encrypted,
        role: role || "user",
      };

      if (!validator.isEmail(email)) {
        return wrapper.response(response, 401, "invalid email format", null);
      }

      if (!password.match(/[|\\/~^:,;?!&%$@*+]/) || !/[A-Z]/.test(password)) {
        return wrapper.response(
          response,
          401,
          "Password must contain uppercase, symbol character !",
          null
        );
      }

      if (password.length < 6) {
        return wrapper.response(
          response,
          401,
          "Minimun length password is 6 charcter !",
          null
        );
      }

      // generate otp
      const findEmail = await authModel.getUserByEmail(email);
      const checkUserActivation = findEmail.rows[0]?.statusActive;

      if (findEmail.rows?.length > 0 && checkUserActivation === "active") {
        return wrapper.response(
          response,
          401,
          "your email already used and already active",
          null
        );
      }

      if (findEmail.rows.length > 0) {
        const generateOtp = Math.floor(100000 + Math.random() * 900000);

        const sendMailOptions = {
          to: email,
          subject: "email verification",
          template: "verificationEmail.html",

          buttonUrl: `https://vechicle-rental-backend.vercel.app/api/auth/verify/${generateOtp}`,
          otp: generateOtp,
        };

        console.log("test");

        const findEmail2 = await authModel.getUserByEmail(email);

        await client.setEx(
          `otp:${generateOtp}`,
          3600,
          JSON.stringify({ userId: findEmail2.rows[0].userId })
        );

        await sendEmail(sendMailOptions);

        return wrapper.response(
          response,
          401,
          "email already used, but not active yet. please check your email!"
        );
      }
      const generateOtp = Math.floor(100000 + Math.random() * 900000);

      // PROSES MENYIMPAN DATA KE DATABASE LEWAT MODEL

      const user = await User.createUser(setData);

      const sendMailOptions = {
        to: email,
        subject: "email verification",
        template: "verificationEmail.html",
        buttonUrl: `https://vechicle-rental-backend.vercel.app/api/auth/verify/${generateOtp}`,
        otp: generateOtp,
      };

      const findEmail2 = await authModel.getUserByEmail(email);

      await client.setEx(
        `otp:${generateOtp}`,
        3600,
        JSON.stringify({ userId: findEmail2.rows[0].userId })
      );

      await sendEmail(sendMailOptions);

      return wrapper.response(
        response,
        201,
        "Success Register Please Check Your Email",
        user.rows
      );
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  login: async (request, response) => {
    try {
      const { email, password } = request.body;

      if (!validator.isEmail(email)) {
        return wrapper.response(response, 401, "invalid email format", null);
      }

      // 1. PROSES PENGECEKAN EMAIL
      const checkEmail = await authModel.getUserByEmail(email);

      if (checkEmail.rows.length < 1) {
        return wrapper.response(response, 404, "Wrong email input", null);
      }

      const validate = await bcrypt.compare(
        password,
        checkEmail.rows[0].password
      );

      // 2. PROSES PENCOCOKAN PASSWORD
      if (!validate) {
        return wrapper.response(response, 401, "Wrong Password!", null);
      }

      console.log(checkEmail.rows[0].statusActive);

      if (checkEmail.rows[0].statusActive !== "active") {
        return wrapper.response(response, 401, "Verify your email first", null);
      }

      const payload = {
        userId: checkEmail.rows[0].userId,
        role: !checkEmail.rows[0].role ? "user" : checkEmail.rows[0].role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      // membuat refresh token
      const refreshToken = jwt.sign(payload, process.env.REFRESH_KEYS_OAUTH, {
        expiresIn: "36h",
      });
      // 4. PROSES REPON KE USER
      return wrapper.response(response, 200, "Success Login", {
        userId: payload.userId,
        token,
        role: payload.role,
        refreshToken,
      });
    } catch (error) {
      return console.log(error);
    }
  },
  refreshToken: async (req, res) => {
    try {
      const { refreshtoken } = req.headers;
      // pengecekkan
      if (!refreshtoken) {
        return wrapper.response(res, 400, "refresh token must be filled", null);
      }

      let payload;
      let token;
      let newRefreshToken;

      if (!refreshtoken) {
        return wrapper.response(res, 400, "refresh token must be filled", null);
      }

      const checkTokenBlackList = await client.get(
        `refreshToken:${refreshtoken}`
      );

      if (checkTokenBlackList) {
        return wrapper.response(
          res,
          403,
          "Your token has been destryoed",
          null
        );
      }

      // ketika mau generate access tokennya lagi, maka ini harus di hapus terlebih dahulu
      jwt.verify(
        refreshtoken,
        process.env.REFRESH_KEYS_OAUTH,
        (error, result) => {
          if (error) {
            return wrapper.response(res, 403, error.message, null);
          }
          payload = {
            userId: result.userId,
            role: result.role,
          };
          token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "24h",
          });

          newRefreshToken = jwt.sign(payload, process.env.REFRESH_KEYS_OAUTH, {
            expiresIn: "36h",
          });

          client.setEx(`refreshToken:${refreshtoken}`, 3600 * 36, refreshtoken);
        }
      );

      return wrapper.response(res, 200, "success refresh token", {
        userId: payload.userId,
        token,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      console.log(error);
    }
  },
  logout: async (req, res) => {
    try {
      let token = req.headers.authorization;
      // eslint-disable-next-line prefer-destructuring
      const { refreshtoken } = req.headers;
      token = token.split(" ")[1];
      console.log(req.headers);
      client.setEx(`accessToken:${token}`, 3600, token);
      client.setEx(`refreshToken:${refreshtoken}`, 3600, refreshtoken);
      return wrapper.response(res, 200, "success log out", null);
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(res, status, statusText, errorData);
    }
  },
  verify: async (req, res) => {
    try {
      const { id } = req.params;
      const verifyOtp = await client.get(`otp:${id}`);
      if (!verifyOtp) {
        return wrapper.response(
          res,
          404,
          "We couldn't find your otp, please register first!",
          null
        );
      }
      const userId = JSON.parse(verifyOtp);
      await User.updateStatusActive(userId.userId, {
        statusActive: "active",
      });
      // await client.del(`otp:${id}`);

      // const newResult = {
      //   userId: user.data[0].userId,
      // };
      return wrapper.response(res, 200, "Account has been activated", []);
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(res, status, statusText, errorData);
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const findEmail = await authModel.getUserByEmail(email);

      if (findEmail.rows.length === 0) {
        return wrapper.response(res, 401, "email not exist", null);
      }

      const generateOtp = Math.floor(100000 + Math.random() * 900000);

      const sendMailOptions = {
        to: email,
        subject: "forgot password",
        template: "resetPassword.html",
        buttonUrl: `https://vechicle-rental-backend.vercel.app/api/auth/resetPassword/${generateOtp}`,
        otp: generateOtp,
      };

      await sendEmail(sendMailOptions);

      await client.setEx(
        `forgotPasswordOTP:${generateOtp}`,
        3600,
        JSON.stringify({ userId: findEmail.rows[0].userId })
      );

      return wrapper.response(
        res,
        200,
        "Process success please check your email",
        [{ email: findEmail.rows[0].email }]
      );
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(res, status, statusText, errorData);
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { otp } = req.params;
      const { newPassword, confirmPassword } = req.body;
      const resetPasswordOtp = await client.get(`forgotPasswordOTP:${otp}`);
      const userReset = JSON.parse(resetPasswordOtp);
      if (!resetPasswordOtp) {
        return wrapper.response(
          res,
          404,
          "otp can't be used, please do forgot password process first!",
          null
        );
      }

      if (
        !newPassword.match(/[|\\/~^:,;?!&%$@*+]/) ||
        !/[A-Z]/.test(newPassword)
      ) {
        return wrapper.response(
          req,
          401,
          "Password must contain uppercase, symbol character !",
          null
        );
      }

      if (newPassword.length < 6) {
        return wrapper.response(
          req,
          401,
          "Minimun length password is 6 charcter !",
          null
        );
      }

      if (newPassword !== confirmPassword) {
        return wrapper.response(
          res,
          401,
          "your new password and confirm password, did not match",
          null
        );
      }
      const salt = await bcrypt.genSalt(10);
      const encrypted = await bcrypt.hash(newPassword, salt);

      const setData = {
        password: encrypted,
      };

      await User.updateUser(userReset.userId, setData);
      const getUser = await User.getDataById(userReset.userId);
      await client.del(`forgotPasswordOTP:${otp}`);

      return wrapper.response(res, 200, "success reset password ", {
        userId: getUser.rows[0].userId,
      });
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(res, status, statusText, errorData);
    }
  },
};
