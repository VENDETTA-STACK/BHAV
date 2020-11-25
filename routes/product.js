var express = require('express');
var path = require("path");
var fs = require("fs");
var multer = require("multer");
var router = express.Router();
var productSchema = require('../model/productModel');
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

router.post("/addProduct" , uploadProduct.single("productImage") , async function(req,res,next){
    const { productName , mandiId , productImage , yesterDayPrice , toDayPrice , priceChangeIndicator } = req.body;
    const file = req.file;
    let indiCator = yesterDayPrice - toDayPrice;
    let PriceIndi;
    if(indiCator > 0){
        PriceIndi = 1; //increase
    }else if(indiCator < 0){
        PriceIndi = -1; // Same
    }else{
        PriceIndi = 0; // decrease
    }
    try {
        var record = await new productSchema({
            productName: productName,
            mandiId: mandiId,
            productImage: file == undefined ? " " : file.path,
            yesterDayPrice: yesterDayPrice,
            toDayPrice: toDayPrice,
            priceChangeIndicator: PriceIndi,
        });
        let data = record.save();
        console.log(record);
        if(record){
            res.status(200).json({ IsSuccess: true , Data: [record] , Message: "Product Added Successfully" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Product Not Added" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getProducts" , async function(req,res,next){
    try {
        var record = await productSchema.find()
                                        .populate({
                                            path: "mandiId",
                                            select: "MandiName State City"
                                        });
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Products Found" });
        }
        else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No Products Available" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getMandiProducts" , async function(req,res,next){
    const { mandiId } = req.body;
    try {
        var record = await productSchema.find({ mandiId: mandiId });
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Products Found" });
        }
        else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No Products Available" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

module.exports = router;
