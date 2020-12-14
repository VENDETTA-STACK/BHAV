var express = require('express');
var path = require("path");
var fs = require("fs");
var multer = require("multer");
var router = express.Router();
var productSchema = require('../model/productModel');
var productByFarmerSchema = require('../model/farmerProduct');
var config = require('../config')
const mongoose = require("mongoose");

var productStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/products");
    },
    filename: function(req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});

var uploadProduct = multer({ storage: productStorage });

router.post("/addProductByFarmer" , async function(req,res,next){
    const { farmerId , mandiId , productId , productInKG , farmerLat , farmerLng , salesPricePerKG } = req.body;

    try {
        var record = await new productByFarmerSchema({
            farmerId: farmerId,
            mandiId: mandiId,
            productId: productId,
            productInKG: productInKG,
            farmerLat: farmerLat,
            farmerLng: farmerLng,
            salesPricePerKG: salesPricePerKG
        });
        if(record){
            record.save();
            res.status(200).json({ IsSuccess: true , Data: [record] , Message: "Your Product Added To Mandi" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Your Product Not Added" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getFarmerProduct" , async function(req,res,next){
    const { farmerId } = req.body;
    try {
        var record = await productByFarmerSchema.find({farmerId: farmerId})
                                                .populate({
                                                    path: "farmerId"
                                                })
                                                .populate({
                                                    path: "mandiId"
                                                })
                                                .populate({
                                                    path: "productId"
                                                });
        if(record){
            // record.save();
            res.status(200).json({ IsSuccess: true , Data: [record] , Message: "Products Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No Product Found" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

module.exports = router;