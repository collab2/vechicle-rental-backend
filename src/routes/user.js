const router = require("express").Router();
const uploadMiddleware = require("../middleware/uploadFile");

const userController = require("../controller/user");

router.patch(
  "/:id",
  uploadMiddleware.uploadUser,
  userController.updateProfileUser
);

router.get("/:id", userController.getDataUser);

module.exports = router;
