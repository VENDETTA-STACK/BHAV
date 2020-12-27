var express = require('express');
var path = require("path");
var fs = require("fs");
var multer = require("multer");
var router = express.Router();
var productSchema = require('../model/productModel');
var stateSchema = require('../model/stateModel');
var citySchema = require('../model/cityModel');
var adminSchema = require('../model/adminData');
var config = require('../config')
const mongoose = require("mongoose");
const { Console } = require('console');
const { populate } = require('../model/productModel');
var updatedProductPriceSchema = require('../model/updatedPriceModel');
var moment = require("moment-timezone");
const e = require('express');
const { route } = require('./product');

router.post("/adminRegister" , async function(req,res,next){
    const { UserName , Password } = req.body;
    try {
        var record = await new adminSchema({
            UserName: UserName,
            Password: Password,
        });
        if(record){
            await record.save();
            res.status(200).json({ IsSuccess: true , Data: [record] , Message: "Admin Added" });
        }
        else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Not Added" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/adminLogin" , async function(req,res,next){
    const { UserName , Password } = req.body;
    try {
        var record = await adminSchema.find({
            UserName: UserName,
            Password: Password,
        });
    //    console.log(record);
        if(record.length == 1){
            //await record.save();
            res.status(200).json({ IsSuccess: true , Message: "Admin LoggedIn" });
        }
        else{
            res.status(200).json({ IsSuccess: true , Message: "Not Registered" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/addState" , async function(req,res,next){
    const { State } = req.body;
    try {
        var record = await new stateSchema({
            State: State,
        });
        if(record){
            await record.save();
            res.status(200).json({ IsSuccess: true , Data: [record] , Message: "State Added" });
        }
        else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Not Added" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getState" , async function(req,res,next){
    try {
        var record = await stateSchema.find();
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "States Found" });
        }
        else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No States Available" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/addCity" , async function(req,res,next){
    const { State , City } = req.body;
    try {
        var record = await new citySchema({
            State: State,
            City: City
        });
        if(record){
            await record.save();
            res.status(200).json({ IsSuccess: true , Data: [record] , Message: "City Added" });
        }
        else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Not Added" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getCity" , async function(req,res,next){
    try {
        var record = await citySchema.find()
                                     .populate({
                                        path: "State",
                                     });
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "States Found" });
        }
        else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No States Available" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

function getCurrentDate(){
    let todayDate = moment()
    .tz("Asia/Calcutta")
    .format("DD MM YYYY, h:mm:ss a")
    .split(",")[0];
    todayDate = todayDate.split(" ");
    todayDate = todayDate[0] + "/" + todayDate[1] + "/" + todayDate[2];
    return todayDate;
}

function getCurrentTime(){
    let todayTime = moment()
    .tz("Asia/Calcutta")
    .format("DD MM YYYY, h:mm:ss a")
    .split(",")[1];
    return todayTime;
}

router.post("/addProductUpdatePrice", async function(req,res,next){
    const { stateId ,date ,mandiId , productId , highestPrice , yesterDayHigh } = req.body;
    try {
        let existRecord = await updatedProductPriceSchema.find({
            stateId: stateId,
            mandiId: mandiId,
            productId: productId,
        });
        
        console.log(existRecord.length);
        if(existRecord.length > 0){
            let yesterDayLowest = existRecord[0].lowestPrice;
            let yesterDayHighest = existRecord[0].highestPrice;
            console.log("Exist Data Updation");
            console.log(existRecord[0]._id);
            let updateIs = {
                stateId: stateId,
                mandiId: mandiId,
                productId: productId,
                highestPrice: highestPrice,
                date: date == undefined ? getCurrentDate() : date,
                yesterDayHigh : yesterDayHighest,
            }
            var updateRecord = await updatedProductPriceSchema.findByIdAndUpdate(existRecord[0]._id,updateIs);
            res.status(200).json({ IsSuccess: true , Data: 1 , Message: "Product Price Updated" });
        }else{
            var record = await new updatedProductPriceSchema({
                stateId: stateId,
                mandiId: mandiId,
                productId: productId,
                highestPrice: highestPrice,
                date: date == undefined ? getCurrentDate() : date,
                yesterDayHigh: 0,
            });
            record.save();
            if(record){
                res.status(200).json({ IsSuccess: true , Data: [record] , Message: "Product Price Added" });
            }else{
                res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Product Price Not Added" });
            }
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getProductUpdatePrice", async function(req,res,next){
    try {
        var record = await updatedProductPriceSchema.find()
                                                    .populate({
                                                        path: "stateId"
                                                    })
                                                    .populate({
                                                        path: "mandiId",
                                                        select: "MandiName MandiMarathiName"
                                                    })
                                                    .populate({
                                                        path: "productId",
                                                    });
    
        if(record){
            res.status(200).json({ IsSuccess: true ,Count: record.length , Data: record , Message: "Data Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Data Not Found" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getMandiWiseCrop" , async function(req,res,next){
    const { stateId , mandiId } = req.body;
    try {
        var record = await updatedProductPriceSchema.find({ 
                                                        stateId: mongoose.Types.ObjectId(stateId), 
                                                        mandiId: mongoose.Types.ObjectId(mandiId), 
                                                    })
                                                    .populate({
                                                        path: "stateId"
                                                    })
                                                    .populate({
                                                        path: "mandiId",
                                                        select: "MandiName MandiMarathiName"
                                                    })
                                                    .populate({
                                                        path: "productId"
                                                    });
        if(record.length > 0){
            res.status(200).json({ IsSuccess: true , Count: record.length ,Data: record , Message: "Data Found...!!!" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Data Not Found" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getCropPriceStateWise" , async function(req,res,next){
    const { productId , stateId } = req.body;
    try {
        var record = await updatedProductPriceSchema.find({
                                        productId: mongoose.Types.ObjectId(productId),
                                        stateId: mongoose.Types.ObjectId(stateId),
                                        date: getCurrentDate()
                                        // date: "24/12/2020"
                                    })
                                    .populate({
                                        path: "stateId"
                                    })
                                    .populate({
                                        path: "productId"
                                    })
                                    .populate({
                                        path: "mandiId",
                                        select: "MandiName MandiMarathiName"
                                    });
            console.log(record);
        // let dataIs = [];
        // // console.log(`Current Date : ${getCurrentDate()}`)
        // for(let i in record){
        //     // console.log(record[i].date);
        //     let dateList = record[i].date.split("/");
        //     // console.log(dateList[0]);
        //     let yesterdayDate = parseFloat(dateList[0] - 1) + "/" + dateList[1] + "/" + dateList[2];
        //     console.log(yesterdayDate);
        //     let yesterDayPriceIs = await updatedProductPriceSchema.find({
        //                                 $and : [
        //                                     {productId: record[i].productId._id},
        //                                     {stateId: record[i].stateId._id},
        //                                     {mandiId: record[i].mandiId._id},
        //                                     {date: yesterdayDate},
        //                                 ]
        //     });
        //     console.log(" le :"+yesterDayPriceIs.length);
        //     // console.log(" l :"+yesterDayPriceIs[i]);
        //     console.log(`${i} : ${yesterDayPriceIs.length}`);
        //     // console.log(yesterDayPriceIs.length);
        //     let yesterDayHigh = 0;
        //     let yesterDayLow = 0;
        //     if(yesterDayPriceIs.length != 0){
        //         // priceIs = 0; 
        //         console.log("yes");
        //         yesterDayHigh = yesterDayPriceIs[0].highestPrice;
        //         yesterDayLow = yesterDayPriceIs[0].lowestPrice;
        //     }else{
        //         console.log("no");
        //         yesterDayHigh = 0;
        //         yesterDayLow = 0
        //     }
        //     let temp = {
        //         today: record[i],
        //         yesterDay: {
        //             yesterDayHighest : yesterDayHigh,
        //             yesterDayLowest : yesterDayLow
        //         }
        //     }
        //     dataIs.push(temp);    
        // }
        if(record.length > 0){
            res.status(200).json({ IsSuccess: true , Count: record.length ,Data: record , Message: "Data Found...!!!" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Data Not Found" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getProducPriceMandiWise", async function(req,res,next){
    const { stateId , mandiId , productId } = req.body;
    try {
        var record = await updatedProductPriceSchema.find({
            productId: mongoose.Types.ObjectId(productId),
            stateId: mongoose.Types.ObjectId(stateId),
            mandiId: mongoose.Types.ObjectId(mandiId),
        });
        if(record){
            res.status(200).json({ IsSuccess: true , Count: record.length ,Data: record , Message: "Data Found...!!!" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Data Not Found" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getCropPriceInAllMandi", async function(req,res,next){
    const { productId } = req.body;
    try {
        var productPriceDataIs = await updatedProductPriceSchema.find({ productId: productId })
                                                                .populate({
                                                                    path: "productId"
                                                                })
                                                                .populate({
                                                                    path: "mandiId",
                                                                    select: "MandiName MandiMarathiName"
                                                                })
                                                                .populate({
                                                                    path: "stateId"
                                                                });
        // console.log(productPriceDataIs);
        // let dataIs = [];
        // // console.log(`Current Date : ${getCurrentDate()}`)
        // for(let i in productPriceDataIs){
        //     // console.log(productPriceDataIs[i].date);
        //     let dateList = productPriceDataIs[i].date.split("/");
        //     // console.log(dateList[0]);
        //     let yesterdayDate = parseFloat(dateList[0] - 1) + "/" + dateList[1] + "/" + dateList[2];
        //     console.log(yesterdayDate);
        //     let yesterDayPriceIs = await updatedProductPriceSchema.find({
        //                                 $and : [
        //                                     {productId: productPriceDataIs[i].productId._id},
        //                                     {stateId: productPriceDataIs[i].stateId._id},
        //                                     {mandiId: productPriceDataIs[i].mandiId._id},
        //                                     {date: yesterdayDate},
        //                                 ]
        //     });
        //     console.log(" le :"+yesterDayPriceIs.length);
        //     // console.log(" l :"+yesterDayPriceIs[i]);
        //     console.log(`${i} : ${yesterDayPriceIs.length}`);
        //     // console.log(yesterDayPriceIs.length);
        //     let yesterDayHigh = 0;
        //     let yesterDayLow = 0;
        //     if(yesterDayPriceIs.length != 0){
        //         // priceIs = 0; 
        //         console.log("yes");
        //         yesterDayHigh = yesterDayPriceIs[0].highestPrice;
        //         yesterDayLow = yesterDayPriceIs[0].lowestPrice;
        //     }else{
        //         console.log("no");
        //         yesterDayHigh = 0;
        //         yesterDayLow = 0
        //     }
        //     let temp = {
        //         today: productPriceDataIs[i],
        //         yesterDay: {
        //             yesterDayHighest : yesterDayHigh,
        //             yesterDayLowest : yesterDayLow
        //         }
        //     }
        //     dataIs.push(temp);    
        // }
        // console.log(dataIs);
        if(productPriceDataIs.length > 0){
            res.status(200).json({ IsSuccess: true , 
                            Count: productPriceDataIs.length,
                            Data: productPriceDataIs, 
                            Message: "Data Found...!!!" 
                        });
        }else{
            res.status(200).json({ IsSuccess: true ,Data: 0 , Message: "Data Not Found...!!!" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

// router.post("/addTestData" , async function(req,res,next){
//     let record = await 
// });

module.exports = router;