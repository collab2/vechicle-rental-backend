const router = require("express").Router();
const authController = require("../controller/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verify/:id", authController.verify);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:otp", authController.resetPassword);

module.exports = router;
