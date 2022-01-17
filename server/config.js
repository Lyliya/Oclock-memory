require("dotenv").config();
const env = process.env.NODE_ENV || "development";

const config = {
  development: {
    port: 3000
  },
  test: {
    port: 80
  },
  production: {
    port: 443
  }
};

module.exports = config[env];
