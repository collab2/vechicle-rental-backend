const router = require("express").Router();
const auth = require("./auth");
const categoryRoutes = require("./category");
const productRoutes = require("./product");
const userRoutes = require("./user");
const reservationRoutes = require("./reservation");
// ISI ROUTER DARI REQUEST KALIAN

router.use("/product", productRoutes);
router.use("/user", userRoutes);
router.use("/auth", auth);
router.use("/category", categoryRoutes);
router.use("/reservation", reservationRoutes);

module.exports = router;
