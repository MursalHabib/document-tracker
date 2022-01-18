const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const { sequelize } = require("../db/models");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());

app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/docs/", require("./routes/document"));

app.listen(PORT, async () => {
  console.log(`RUNNING ON PORT ${PORT}`);
  await sequelize.sync({ force: false });
  console.log("DATABASE SYNCED...");
});
