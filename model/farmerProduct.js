const mongoose = require("mongoose");

const productByFarmerSchema = mongoose.Schema({
    orderNo: {
        type: String
    },
    farmerId: {
        type: mongoose.Types.ObjectId, ref: "customer",
    },
    mandiId: {
        type: mongoose.Types.ObjectId, ref: "Mandi",
    },
    productId: {
        type: mongoose.Types.ObjectId, ref: "product",
    },
    productInKG: {
        type: Number,
    },
    farmerLat: {
        type: Number
    },
    farmerLng: {
        type: Number
    },
    // salesPricePerKG: {
    //     type: Number
    // },
    totalCost: {
        type: Number
    },
    profit: {
        type: Number
    },
    Date: {
        type: String
    },
    Time: {
        type: String
    }
});

module.exports = mongoose.model("farmerProduct", productByFarmerSchema);