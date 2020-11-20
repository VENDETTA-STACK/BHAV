const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
    },
    mobile: {
        type: String,
    },
    location: {
       lat: {
        type: String,
       },
       long: {
        type: String
       },
       completeAddress: {
        type: String
       }
    },
    landSizeOwned:{
        type: Number,
    },
    state: {
        type: mongoose.Types.ObjectId,
        ref: "State",
    },
    city: {
        type: mongoose.Types.ObjectId,
        ref: "City",
    }
});

module.exports = mongoose.model("customer", customerSchema);