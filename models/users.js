const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 3,
        max: 50,
        required: true
    },
    email: {
        type: String,
        min: 5,
        max: 255,
        required: true,
        unique: true
    },
    password: {
        type: String,
        min: 5,
        max: 1024,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, process.env.jwtPrivateKey);
    return token;
} 

module.exports = mongoose.model("User", userSchema);