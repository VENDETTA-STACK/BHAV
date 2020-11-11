const mongoose = require("mongoose");

const stateSchema = mongoose.Schema({
    State: {
        type: String,
    },
});

module.exports = mongoose.model("State", stateSchema);