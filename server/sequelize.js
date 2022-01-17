const { Sequelize } = require("sequelize");
require('dotenv').config()
const fs = require('fs');

let dbConfig;

const env = process.env.NODE_ENV || "development";

const loadJsonFile = () => {
    try {
        dbConfig = JSON.parse(fs.readFileSync("./config/config.json", "utf-8"));
    } catch (e) {
        console.log("Error on DBConfig parsing");
    }
}

loadJsonFile();

const sequelize = new Sequelize(dbConfig[env]);

module.exports = sequelize;