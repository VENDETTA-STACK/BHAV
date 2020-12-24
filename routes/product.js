var express = require('express');
var path = require("path");
var fs = require("fs");
var multer = require("multer");
var router = express.Router();
var productSchema = require('../model/productModel');
var productByFarmerSchema = require('../model/farmerProduct');
var config = require('../config')
const mongoose = require("mongoose");
var productStateSchema = require('../model/productStateModel');
var mandiSchema = require('../model/mandiModel');

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


//Master Product Add
router.post("/addProduct" , uploadProduct.single("productImage") , async function(req,res,next){
    const { productName , productImage } = req.body;
    const file = req.file;
    // let indiCator = yesterDayPrice - toDayPrice;
    // let PriceIndi;
    // if(indiCator > 0){
    //     PriceIndi = 1; //increase
    // }else if(indiCator < 0){
    //     PriceIndi = -1; // Same
    // }else{
    //     PriceIndi = 0; // decrease
    // }
    try {
        var record = await new productSchema({
            productName: productName,
            productImage: file == undefined ? " " : file.path,
            // priceChangeIndicator: PriceIndi,
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
        var record = await productSchema.find();
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

router.post("/addProductState", async function(req,res,next){
    const { stateId , productId } = req.body;
    try {
        var record = await new productStateSchema({
            stateId: stateId,
            productId: productId
        });
        record.save();
        if(record){
            res.status(200).json({ IsSuccess: true , Data: [record] , Message: "Product with State Added" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Not Added" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getProductState", async function(req,res,next){
    try {
        var record = await productStateSchema.find()
                                             .populate({
                                                 path: "stateId"
                                             })
                                             .populate({
                                                path: "productId"
                                            });
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Products Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Products Not Found" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getMandiProducts" , async function(req,res,next){
    const { mandiId } = req.body;
    try {
        
        var record = await mandiSchema.find({ _id: mandiId })
                                      .populate({
                                          path: "productId",
                                      })
                                      .populate({
                                          path: "State"
                                      });
        // console.log(record.length);
        if(record.length > 0){
            res.status(200).json({ IsSuccess: true , Count: record.length , Data: record , Message: "Products Found" });
        }
        else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No Products Available" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getProductDetails" , async function(req,res,next){
    const { productId } = req.body;
    try {
        var record = await productByFarmerSchema.find({ productId: productId })
                                                .populate({
                                                    path: "farmerId"
                                                })
                                                .populate({
                                                    path: "mandiId",
                                                })
                                                .populate({
                                                    path: "productId",
                                                });
        if(record){
            res.status(200).json({ IsSuccess: true , Count: record.length , Data: record , Message: "Product Mandi" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No Data Available" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});



module.exports = router;
