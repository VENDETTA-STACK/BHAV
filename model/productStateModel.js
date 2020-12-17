const mongoose = require("mongoose");

const productStateSchema = mongoose.Schema({
    stateId: {
        type: mongoose.Types.ObjectId, ref: "State",
    },
    productId: {
        type: mongoose.Types.ObjectId, ref: "product",
    }
});

module.exports = mongoose.model("productState", productStateSchema);