const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
    name: {
        type: String,
    },
    mobile: {
        type: String,
        require: true,
        // unique: true
    },
    location: {
       lat: {
        type: Number,
       },
       long: {
        type: Number
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
});

module.exports = mongoose.model("customer", customerSchema);