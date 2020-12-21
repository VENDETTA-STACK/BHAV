const mongoose = require("mongoose");

const productSchema = mongoose.Schema({

    productName: {
        type: String,
    },
    mandiId: {
        type: mongoose.Types.ObjectId, ref: "Mandi",
    },
    productImage: {
        type: String,
    },
    priceChangeIndicator: {
        type: Number,
    },
});

module.exports = mongoose.model("product", productSchema);