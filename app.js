const express = require("express");
const bodyParse = require("body-parser");

const app = express();
const {API_VERSION} = require("./config");

// Load Routings
// ....

app.use(bodyParse.urlencoded({extended: false}))
app.use(bodyParse.json())

// Configure Header HTTP
// ....

// Router Basic

module.exports = app;