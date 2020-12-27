const mongoose = require("mongoose");

const mandiSchema = mongoose.Schema({

    MandiName: {
        type: String,
    },
    MandiMarathiName: {
        type: String,
    },
    State: {
        type: mongoose.Types.ObjectId, ref: "State",
    },
    productId: [{
        type: mongoose.Types.ObjectId, ref: "product",
    }],
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
    // City:{
    //     type: mongoose.Types.ObjectId, ref: "City",
    // },
});

module.exports = mongoose.model("Mandi", mandiSchema);