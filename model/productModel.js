const mongoose = require("mongoose");

const productSchema = mongoose.Schema({

    productName: {
        type: String,
    },
    productImage: {
        type: String,
    },
    yesterDayPrice: {
        type: Number,
    },
    toDayPrice:{
        type: Number,
    },
    priceChangeIndicator: {
        type: Number,
    },
});

module.exports = mongoose.model("product", productSchema);