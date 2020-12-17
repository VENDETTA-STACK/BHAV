const mongoose = require("mongoose");

const companyProductSchema = mongoose.Schema({

    companyId: {
        type: String,
    },
    stateId: {
        type: mongoose.Types.ObjectId, ref: "State",
    },
    productId: [{
        type: mongoose.Types.ObjectId, ref: "product",
    }],
});

module.exports = mongoose.model("CompanyProduct", companyProductSchema);