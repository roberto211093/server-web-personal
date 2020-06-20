const express = require("express");
const MailController = require("../controllers/mail");
const api = express.Router();

api.post("/send-mail", MailController.postSendMail);

module.exports = api;