const express = require("express");
const UserController = require("../controllers/user");
const multipart = require("connect-multiparty");

const md_auth = require("../middleware/authenticated");
const md_update_user = multipart({uploadDir: "./uploads/avatar"});
const api = express.Router();

api.post("/sign-up", UserController.postSignUp);
api.post("/sign-in", UserController.postSignIn);
api.get("/users", [md_auth.ensureAuth], UserController.getUsers);
api.get("/users-active", [md_auth.ensureAuth], UserController.getUsersActive);
api.put("/update-avatar/:id", [md_auth.ensureAuth, md_update_user], UserController.putUpdateAvatar);
api.get("/get-avatar/:avatarName", UserController.getAvatar);
api.put("/update-user/:id", [md_auth.ensureAuth], UserController.putUpdateUser);
api.put("/activate-user/:id", [md_auth.ensureAuth], UserController.putActivateUser);
api.delete("/delete-user/:id", [md_auth.ensureAuth], UserController.deleteUser);
api.post("/sign-up-admin", [md_auth.ensureAuth], UserController.postSignUpAdmin);

module.exports = api;