const express = require("express");
const bodyParse = require("body-parser");

const app = express();
const {API_VERSION} = require("./config");

// Load Routings
const userRoutes = require('./routers/user')

app.use(bodyParse.urlencoded({extended: false}))
app.use(bodyParse.json())

// Configure Header HTTP
// ....

// Router Basic
app.use(`/api/${API_VERSION}`, userRoutes);

module.exports = app;