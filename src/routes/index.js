const router = require("express").Router();
const auth = require("./auth");
const categoryRoutes = require("./category");
const productRoutes = require("./product");
// ISI ROUTER DARI REQUEST KALIAN

router.use("/product", productRoutes);
router.use("/auth", auth);
router.use("/category", categoryRoutes);

module.exports = router;
