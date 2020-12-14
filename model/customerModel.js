const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
    },
    mobile: {
        type: String,
        unique: true
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
    city: {
        type: mongoose.Types.ObjectId,
        ref: "City",
    },
    category: {
        type: String,
        default: "Customer"
    }
});

module.exports = mongoose.model("customer", customerSchema);