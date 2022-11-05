const express = require("express");
require("dotenv").config();

const app = express();
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const xss = require("xss-clean");
const compression = require("compression");
const bodyParser = require("body-parser");
// const client = require("./src/config/redis");

const routerNavigation = require("./src/routes/index");

app.use(cors()); // kemanan juga
app.use(helmet()); // helmet = untuk keaman dibagian header
app.use(xss()); // xss = cross site scripting
app.use(compression()); // compression = respon

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", routerNavigation);
// app.use("/api", routerNavigation);

app.use("*", (req, res) => {
  res.send("not found");
});

app.listen(process.env.PORT, () => {
  // jika sudah selesai, disable consolenya hapus lagi
  console.log(`Server running on port ${process.env.PORT}`);
});
