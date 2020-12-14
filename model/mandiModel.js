const mongoose = require("mongoose");

const mandiSchema = mongoose.Schema({

    MandiName: {
        type: String,
    },
    // Product: {
    //     type: mongoose.Types.ObjectId, ref: "product",
    // },
    State: {
        type: mongoose.Types.ObjectId, ref: "State",
    },
    City:{
        type: mongoose.Types.ObjectId, ref: "City",
    },
});

module.exports = mongoose.model("Mandi", mandiSchema);