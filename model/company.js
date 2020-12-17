const mongoose = require("mongoose");

const companySchema = mongoose.Schema({

    companyName: {
        type: String,
    },
    stateId: {
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
});

module.exports = mongoose.model("Company", companySchema);