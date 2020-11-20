const mongoose = require("mongoose");
const { types } = require("util");

const citySchema = mongoose.Schema({
    State: {
        type: mongoose.Types.ObjectId, 
        ref: "State",
    },
    City: {
        type: String,
    }
});

module.exports = mongoose.model("City", citySchema);