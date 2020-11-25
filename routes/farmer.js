var express = require('express');
var path = require("path");
var fs = require("fs");
var multer = require("multer");
var router = express.Router();
var productSchema = require('../model/productModel');
var config = require('../config')
const mongoose = require("mongoose");

// var productStorage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, "uploads/products");
//     },
//     filename: function(req, file, cb) {
//         cb(
//             null,
//             file.fieldname + "_" + Date.now() + path.extname(file.originalname)
//         );
//     },
// });

// var uploadProduct = multer({ storage: productStorage });

// router.post("/addProduct" , async function(req,res,next){
//     const { farmerName , productName , productInKG , farmerLat , farmerLng , sales } = req.body;

//     try {
//         var record = await 
//     } catch (error) {
//         res.status(500).json({ IsSuccess: false , Message: error.message });
//     }
// });

module.exports = router;