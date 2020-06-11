const express = require("express");
const NewsLetterController = require("../controllers/newsLetter");
const api = express.Router();

api.post("/newsletter/:email", NewsLetterController.postSuscribeEmail);

module.exports = api;