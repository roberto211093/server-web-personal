const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema =  Schema({
    name: String,
    lastname: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    role: String,
    active: Boolean,
    avatar: String,
    privacyPolicy: Boolean
});

module.exports = mongoose.model("user", userSchema);