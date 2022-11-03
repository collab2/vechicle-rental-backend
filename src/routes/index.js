const router = require("express").Router();

const productRoutes = require("./product");
// ISI ROUTER DARI REQUEST KALIAN
router.use("/product", productRoutes);

module.exports = router;
