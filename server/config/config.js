require("dotenv").config();

module.exports = {
  development: {
    host: "10.62.160.9",
    port: 22,
    username: "postgres",
    password: "P0stgr3s@2022#!",
    database: "document_tracker",
    dialect: "postgres",
  },
  test: {
    username: "postgres",
    password: "P0stgr3s@2022#!",
    database: "document_tracker",
    host: "10.62.160.9",
    dialect: "postgres",
    port: 22,
  },
  production: {
    username: "postgres",
    password: "P0stgr3s@2022#!",
    database: "document_tracker",
    host: "10.62.160.9",
    dialect: "postgres",
    port: 22,
  },
};
