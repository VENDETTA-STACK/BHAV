var express = require('express');
var path = require("path");
var fs = require("fs");
var multer = require("multer");
var router = express.Router();
var productSchema = require('../model/productModel');
var mandiSchema = require('../model/mandiModel');
var config = require('../config')
const mongoose = require("mongoose");

router.post("/addMandi" , async function(req,res,next){
    const { MandiName , Product , State , City } = req.body;
    try {
        var record = await new mandiSchema({
            MandiName: MandiName,
            Product: Product,
            State: State,
            City: City,
        });
        if(record){
            res.status(200).json({ IsSuccess: true , Data: [record] , Message: "Mandi Added Successfully" });
            await record.save();
        }else{
            res.status(400).json({ IsSuccess: true , Data: 0 , Message: "Mandi Not Added" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getAllMandi" , async function(req,res,next){
    try {
      var record = await mandiSchema.find()
                                    .populate({
                                        path: "Product"
                                    })
                                    .populate({
                                        path: "State",
                                    })
                                    .populate({
                                        path: "City",
                                    });
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Mandi Data Found" });
        }else{
            res.status(400).json({ IsSuccess: true , Data: 0 , Message: "No Mandi Data Found" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

module.exports = router;