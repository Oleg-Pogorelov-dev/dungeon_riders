const express = require("express");
const app = express();
const cors = require("cors");

const users = require("./routes/users");
const bodyParser = require("body-parser");

process.on("unhandledRejection", (reason, promise) => {
  console.log(reason);
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/", users);

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  res.status(statusCode).json({ message: err.message });
});

module.exports = app;
