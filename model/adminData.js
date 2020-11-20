const mongoose = require("mongoose");
const { types } = require("util");

const adminSchema = mongoose.Schema({
    UserName: {
        type: String,
    },
    Password: {
        type: String,
    }
});

module.exports = mongoose.model("Admin", adminSchema);