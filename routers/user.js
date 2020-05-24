const express = require("express");
const UserController = require("../controllers/user");
const api = express.Router();
const md_auth = require("../middleware/authenticated")

api.post("/sign-up", UserController.signUp);
api.post("/sign-in", UserController.signIn);
api.get("/users", [md_auth.ensureAuth], UserController.getUsers);

module.exports = api;