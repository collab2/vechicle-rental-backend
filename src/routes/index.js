const router = require("express").Router();
const auth = require("./auth");

const productRoutes = require("./product");
// ISI ROUTER DARI REQUEST KALIAN
router.use("/product", productRoutes);
router.use("/auth", auth);

module.exports = router;
