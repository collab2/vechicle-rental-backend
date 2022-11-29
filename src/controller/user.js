const moment = require("moment");
const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const wrapper = require("../utils/wrapper");
const cloudinary = require("../config/cloudinary");

module.exports = {
  getDataUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await userModel.getDataById(id);
      if (user.rows.length === 0) {
        return wrapper.response(res, 404, "user not found", []);
      }
      return wrapper.response(res, 200, "success get data user", user.rows);
    } catch (error) {
      console.log(error);
    }
  },
  updateProfileUser: async (req, res) => {
    try {
      const { id } = req.params;
      const image = req?.file?.filename;
      const checkId = await userModel.getDataById(id);
      const { name, address, phone, birthDate, gender } = req.body;
      const test = req.file.path.split("/").slice(6).join("/");
      const setData = {
        name: name || "",
        address: address || "",
        phone: phone || "",
        birthDate: birthDate || "",
        gender: gender || "",
        image: image || checkId.rows[0].image,
        updatedAt: new Date(),
      };

      if (setData.image) {
        console.log("test");
        cloudinary.uploader.destroy(checkId?.rows[0]?.image, (result) => {
          console.log(result);
        });
      }
      await userModel.updateProfile(id, setData);
      const getDataUser = userModel.getDataById(id);
      return wrapper.response(res, 200, "succes s updated", getDataUser.data);
    } catch (error) {
      console.log(error);
      //   const { status, statusText, error: errorData } = error;
      //   return wrapper.response(res, status, statusText, errorData);
    }
  },
  updatePassword: async (request, response) => {
    try {
      const { userId } = request.params;
      const { oldPassword, newPassword, confirmPassword } = request.body;
      // 1. checking user
      const checkId = await userModel.getDataById(userId);

      if (checkId.rowCount === 0) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${userId} Not Found`,
          []
        );
      }
      // 2. validate old password
      const checkPassword = await userModel.getPasswordById(userId);

      const validate = await bcrypt.compare(
        oldPassword,
        checkPassword.rows[0].password
      );

      console.log(validate);

      if (!validate) {
        if (!validate) {
          return wrapper.response(response, 401, "Wrong Password!", null);
        }
      }
      // 3. check if confirm password is the same as new password
      if (confirmPassword !== newPassword) {
        return wrapper.response(
          response,
          401,
          "New Password doesn't match, Please Try Again"
        );
      }
      // 4. hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const setData = {
        password: hashedPassword,
      };

      await userModel.updateUser(userId, setData);

      return wrapper.response(response, 201, "Success Change Password", null);
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
};
