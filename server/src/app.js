const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const { sequelize } = require("../db/models");
require("dotenv").config();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static(process.cwd() + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(bodyParser.json());

app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/docs/", require("./routes/document"));

app.listen(PORT, async () => {
  console.log(`RUNNING ON PORT ${PORT}`);
  try {
    if (process.env.NODE_ENV === "production") {
      await sequelize.sync({ force: false });
      console.log("DATABASE SYNCED...");
      // process.exit(0);
    }
    console.log("DEVELOPMENT ENV");
  } catch (error) {
    console.log("PESAN ERROR: ", error);
  }
});
