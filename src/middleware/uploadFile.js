const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const wrapper = require("../utils/wrapper");
const cloudinary = require("../config/cloudinary");

module.exports = {
  uploadImagePortfolio: (req, res, next) => {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "AutoRent/Portfolio",
      },
    });

    const fileFilter = (request, file, cb) => {
      if (file.mimetype.startsWith("image")) {
        return cb(null, true);
      }
      cb(null, false);
      return cb(new Error("Only .png .jpg and .jpeg format allowed!"));
    };

    const upload = multer({
      storage,
      fileFilter,
      limits: { fileSize: 500_000 },
    }).array("image");
    // eslint-disable-next-line consistent-return
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return wrapper.response(res, 401, err.message, null);
      }
      if (err) {
        // An unknown error occurred when uploading.
        return wrapper.response(res, 401, err.message, null);
      }

      // Everything went fine.
      next();
    });
  },
  uploadUser: (req, res, next) => {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "AutoRent/user",
      },
    });

    const fileFilter = (request, file, cb) => {
      if (file.mimetype.startsWith("image")) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("Only .png .jpg and .jpeg format allowed!"));
      }
    };

    const upload = multer({
      storage,
      fileFilter,
      limits: { fileSize: 500_000 },
    }).single("image");
    // eslint-disable-next-line consistent-return
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return wrapper.response(res, 401, err.message, null);
      }
      if (err) {
        // An unknown error occurred when uploading.
        return wrapper.response(res, 401, err.message, null);
      }

      // Everything went fine.
      next();
    });
  },
};
