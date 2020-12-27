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
var updatedPriceModel = require('../model/updatedPriceModel');
var demoSchema = require('../model/demoUpdateProductPrice');
var moment = require("moment-timezone");

function calculatelocation(lat1, long1, lat2, long2) {
    if (lat1 == 0 || long1 == 0) {
      area = 1; // Company Lat and Long is not defined.
    } else {
      const location1 = {
        lat: parseFloat(lat1),
        lon: parseFloat(long1),
      };
      const location2 = {
        lat: parseFloat(lat2),
        lon: parseFloat(long2),
      };
      heading = geolib.getDistance(location1, location2);
      if (!isNaN(heading)) {
          return heading;
      } else {
        heading =  -1; // Employee Lat and Long is not defined.
    }
    return heading;
  }
}

router.post("/addMandi" , async function(req,res,next){
    const { MandiName , productId , State , lat , long ,completeAddress , productName} = req.body;
    try {
        var existMandi = await mandiSchema.find({ MandiName: MandiName });
        console.log(existMandi);
        console.log(existMandi.length);
        if(existMandi.length == 1){
            console.log(existMandi[0]._id);
            let updateIs = { $push: { productId: productId } }
            let temp = await mandiSchema.findByIdAndUpdate(existMandi[0]._id,updateIs);  
            res.status(200).json({ IsSuccess: true , Data: 1 , Message: "Product Added To Mandi" });
        }else{
            var record = await new mandiSchema({
                MandiName: MandiName,
                location: {
                    lat : lat,
                    long : long,
                    completeAddress : completeAddress,
                },
                State: State,
                productId: productId
            });
            if(record){
                await record.save();
                res.status(200).json({ IsSuccess: true , Data: [record] , Message: "Mandi Added Successfully" });
            }else{
                res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Mandi Not Added" });
            }
        }

        // if(productName){
        //     var productData = await productSchema.find({ productName: productName });
        //     if(productData.length == 1){
        //         var record1 = await new mandiSchema({
        //             MandiName: MandiName,
        //             State: State
        //         });        
        //     }
        //     console.log(productData[0]._id);
        //     // console.log(productData.length);
        // }else{
        //     var record = await new mandiSchema({
        //         MandiName: MandiName,
        //         location: {
        //             lat : lat,
        //             long : long,
        //             completeAddress : completeAddress,
        //         },
        //         State: State,
        //     });
        //     if(record){
        //         await record.save();
        //         res.status(200).json({ IsSuccess: true , Data: [record] , Message: "Mandi Added Successfully" });
        //     }else{
        //         res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Mandi Not Added" });
        //     }
        // }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

// router.post("/updateMandi", async function(req,res,next){
//     const { lat , long , completeAddress , mandiId } = req.body;
//     try {
//         var updateIs = {
//             location: {
//                 lat : lat,
//                 long : long,
//                 completeAddress : completeAddress,
//             }
//         }
//         var record = await mandiSchema.findByIdAndUpdate(mandiId,updateIs);
//         res.status(200).json({ IsSuccess: true , Data: 1 , Message: "Updated" });
//     } catch (error) {
//         res.status(500).json({ IsSuccess: false , Message: error.message });
//     }
// });

router.post("/updateMandi", async function(req,res,next){
    const { lat , long , completeAddress , mandiName } = req.body;
    try {
        let existMandi = await mandiSchema.find({ MandiName: mandiName});
        console.log(existMandi.length);
        if(existMandi.length == 1){
            console.log(existMandi[0]._id);
            mandiId = existMandi[0]._id;
            var updateIs = {
                location: {
                    lat : lat,
                    long : long,
                    // completeAddress : completeAddress, //NOT TO ADD(TOLD BY ANIRUDH)
                }
            }
            var record = await mandiSchema.findByIdAndUpdate(mandiId,updateIs);
            res.status(200).json({ IsSuccess: true , Data: 1 , Message: "Mandi location Updated" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Mandi Not Exist" });
        }
        
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/updateMandiProduct", async function(req,res,next){
    const { productId , mandiId } = req.body;
    try {
        
        var updateIs = { $push: { productId: productId } }
        var mandiData = await mandiSchema.find({ _id: mandiId });
        
        if(mandiData.length == 1){
            var record = await mandiSchema.findByIdAndUpdate(mandiId,updateIs);
            res.status(200).json({ IsSuccess: true , Data: 1 , Message: "Updated" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Mandi Not Found" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getAllMandi" , async function(req,res,next){
    try {
      var record = await mandiSchema.find()
                                    .populate({
                                        path: "State",
                                    })
                                    .populate({
                                        path: "productId"
                                    });
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Mandi Data Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No Mandi Data Found" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getNearMandi" , async function(req,res,next){
    const { userLat , userLong , uptoKm } = req.body;
    try {
      var record = await mandiSchema.find()
                                    .populate({
                                        path: "State",
                                    });
        var mandis = []
        for(var i=0;i<record.length;i++){
            let mandiLat = parseFloat(record[i].location.lat);
            let mandiLong = parseFloat(record[i].location.long);
            console.log([mandiLat,mandiLong]);
            let distanceFromUser = calculatelocation(userLat,userLong,mandiLat,mandiLong);
            // if(distanceFromUser < )
            distanceFromUser = parseFloat(distanceFromUser) / 1000;
            // console.log(distanceFromUser);
            if(distanceFromUser < uptoKm){
                let dataSet = {
                    mandiData : record[i],
                    Distance : distanceFromUser
                }
                mandis.push(dataSet);
            }
        }
        console.log(mandis);
        if(mandis.length > 0){
            res.status(200).json({ IsSuccess: true , Count: mandis.length , Data: mandis , Message: "Mandi Data Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No Mandi Data Found" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getFilterMandi" , async function(req,res,next){
    const { State , id } = req.body;
    try {
        var record = await mandiSchema.find({ 
                                         State: State,
                                       })
                                      .populate({
                                          path: "State",
                                      })
                                      .populate({
                                        path: "productId",
                                    });
          if(record){
              res.status(200).json({ IsSuccess: true , Data: record , Message: "Mandi Data Found" });
          }else{
              res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No Mandi Data Found" });
          }
      } catch (error) {
          res.status(500).json({ IsSuccess: false , Message: error.message });
      }
});

router.post("/getFilterProductOnMandi" , async function(req,res,next){
    const { mandiId , productId } = req.body;
    try {
        var record = await productMandiSchema.find({ mandiId: mandiId , productId: productId })
                                      .populate({
                                          path: "mandiId",
                                      })
                                      .populate({
                                          path: "productId",
                                      });
          if(record){
              res.status(200).json({ IsSuccess: true , Data: record , Message: "Mandi Data Found" });
          }else{
              res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No Mandi Data Found" });
          }
      } catch (error) {
          res.status(500).json({ IsSuccess: false , Message: error.message });
      }
});

router.post("/getMandiProductPrice" , async function(req,res,next){
    const { mandiId } = req.body;
    try {
        var record = await mandiSchema.find({ _id: mandiId })
        // console.log(record[0].productId);
        let products = record[0].productId;
        // console.log(products);
        // console.log(products.length);

        let productPriceDataIs = [];
        for(let i in products){
            if(products[i]){
                var productsPriceData = await updatedPriceModel.find({
                           productId: products[i],
                           mandiId: mandiId,      
                        })
                        .populate({
                            path: "productId"
                        })
                        .populate({
                            path: "stateId"
                        })
                        .populate({
                            path: "mandiId",
                            select: "MandiName MandiMarathiName",
                        });
                if(productsPriceData.length > 0){
                    productPriceDataIs.push(productsPriceData[0]);
                }   
            }
        }
        // console.log(productPriceDataIs.length);
        // console.log(productPriceDataIs);
        // let dataIs = [];
        // // console.log(`Current Date : ${getCurrentDate()}`)
        // for(let i in productPriceDataIs){
        //     // console.log(productPriceDataIs[i].date);
        //     let dateList = productPriceDataIs[i].date.split("/");
        //     // console.log(dateList[0]);
        //     let yesterdayDate = parseFloat(dateList[0] - 1) + "/" + dateList[1] + "/" + dateList[2];
        //     console.log(yesterdayDate);
        //     let yesterDayPriceIs = await updatedPriceModel.find({
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
            res.status(200).json({ IsSuccess: true , Count: productPriceDataIs.length ,
                                Data: productPriceDataIs , Message: "Data Found" });
        }else{
            res.status(200).json({
                IsSuccess: true , Data: 0 , Message: "Data Not Found"
            });
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


router.post("/insertAllMandiData", async function(req,res,next){
    let allMandi = await mandiSchema.find();
    console.log(allMandi.length);
    let k = 0;
    for(let i=0;i<allMandi.length;i++){
        // console.log(allMandi[i].productId);
        let productList = allMandi[i].productId;
        let mandiId = allMandi[i]._id;
        let StateId = "5fabbe4fd652567fdb848e3a";
        // let productsId = []
        // console.log(mandiId,StateId);
        for(j in allMandi[i].productId){
            // console.log(productList[j]);
            let data = await new updatedPriceModel({
                stateId: StateId,
                mandiId: mandiId,
                productId: productList[j],
                highestPrice: 0,
                yesterDayHigh: 0,
                date: getCurrentDate(),
           })
           console.log(data);
           data.save();
           k = k + 1;
           console.log(k);
        }
        // console.log(a);
    }
    res.status(200).json("Data Added");
});

router.post("/getDistanceFromMandi", async function(req,res,next){
    const { userLat , userLong , mandiId } = req.body;
    try {
        let mandiData = await mandiSchema.find({ _id: mandiId });
        if(mandiData.length){
            let mandiLat = parseFloat(mandiData[0].location.lat);
            let mandiLong = parseFloat(mandiData[0].location.long);
            // console.log([mandiLat,mandiLong]);
            let distanceFromUser = calculatelocation(userLat,userLong,mandiLat,mandiLong);
            
            distanceFromUser = parseFloat(distanceFromUser) / 1000;
            // console.log(distanceFromUser);
            
            res.status(200).json({ 
                                   IsSuccess: true, 
                                   Distance: distanceFromUser, 
                                   Message: "Distance Calculated" 
                                });
        }else{
            res.status(200).json({ IsSuccess: true , Message: "Mandi Not Found" });
        }
    } catch (error) {
        res.status(200).json({ IsSuccess: false , Message: error.message });
    }
});

// router.post("/updateMandiCrops", async function(req,res,next){
//     const aa = req.body;
//     let list = ["5fdc9fed13b7130025988e8c","5fdc9ffe13b7130025988e8e","5fdc9ede13b7130025988e86","5fdc9ee813b7130025988e87","5fdc9f1713b7130025988e8a"];
//     // for(let i in list)
//     let updateIs = { $push: { productId: list } }
//     let record = await mandiSchema.findByIdAndUpdate(aa,updateIs)
//     res.status(200).json("Done...............>!!!!!!!!!");
// });

//Update Marathi Name for Mandi ----27-12-2020----MONIL
router.post("/updateMandiName",async function(req,res,next){
    const { MandiName , MandiMarathiName } = req.body;
    try {
        let existMandi = await mandiSchema.find({ MandiName: MandiName });
        // console.log(existMandi.length);
        if(existMandi.length == 1){
            let updateIs = {
                MandiMarathiName: MandiMarathiName,
            }
            let updateData = await mandiSchema.findByIdAndUpdate(existMandi[0]._id,updateIs);
            res.status(200).json({ IsSuccess: true , Data: 1 , Message: "Mandi Marathi Name Updated" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Mandi Not Found" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});


router.post("/deleteAllMandi", async function(req,res,next){
    console.log("hello");
    let record = await mandiSchema.deleteMany();
});

module.exports = router;