const mongoose = require("mongoose");

const updatedProductPriceSchema = mongoose.Schema({
    stateId: {
        type: mongoose.Types.ObjectId, ref: "State",
    },
    productId: {
        type: mongoose.Types.ObjectId, ref: "product",
    },
    mandiId: {
        type: mongoose.Types.ObjectId, ref: "Mandi",
    },
    date: {
        type: String,
    },
    lowestPrice: {
        type: Number
    },
    highestPrice: {
        type: Number
    },
});

module.exports = mongoose.model("updateProductPrice", updatedProductPriceSchema);