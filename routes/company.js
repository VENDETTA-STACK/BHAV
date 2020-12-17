var express = require('express');
var path = require("path");
var fs = require("fs");
var multer = require("multer");
var router = express.Router();
var productSchema = require('../model/productModel');
var mandiSchema = require('../model/mandiModel');
var productMandiSchema = require('../model/farmerProduct');
var config = require('../config')
const mongoose = require("mongoose");
const geolib = require("geolib");
var NodeGeocoder = require('node-geocoder');
var companySchema = require('../model/company');
var companyProductSchema = require('../model/companyProductModel');
const companyProductModel = require('../model/companyProductModel');

router.post("/addComapny" , async function(req,res,next){
    const { companyName , stateId , lat , long , completeAddress} = req.body;
    try {
        var record = await new companySchema({
            companyName: companyName,
            stateId: stateId,
            // productId: productId,
            lat: lat,
            long: long,
            completeAddress: completeAddress,
        });
        record.save();
        if(record){
            res.status(200).json({ IsSuccess: true , Data: [record] , Message: "Company Added" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Company Not Added" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getComapnyList" , async function(req,res,next){

    try {
        var record = await companySchema.find()
                                        .populate({
                                            path: "stateId"
                                        })
                                        .populate({
                                            path: "productId"
                                        });

        if(record){
            res.status(200).json({ IsSuccess: true , Data: [record] , Message: "Company Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Company Not Found" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/addProductToComapny" , async function(req,res,next){
    const { companyId , productId } = req.body;
    try {
        var updateIs = { $push: { productId: productId } }
        var companyData = await companySchema.find({ _id: companyId });
        if(companyData.length == 1){
            var record = await companySchema.findByIdAndUpdate(companyId,updateIs);
            res.status(200).json({ IsSuccess: true , Data: 1 , Message: "Product Added" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Company Not Found" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

module.exports = router;