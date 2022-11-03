const moment = require("moment");
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
      const { name, address, phone, birthDate, gender } = req.body;
      const setData = {
        name,
        address,
        phone,
        birthDate,
        gender,
        image,
        updatedAt: new Date(),
      };

      const checkId = await userModel.getDataById(id);
      if (image) {
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
};
