const mongoose = require("mongoose");

const genresSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Genre", genresSchema);