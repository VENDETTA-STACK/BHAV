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
    const { MandiName , Product , State , City , lat , long ,completeAddress} = req.body;
    try {
        var record = await new mandiSchema({
            MandiName: MandiName,
            location: {
                lat : lat,
                long : long,
                completeAddress : completeAddress,
            },
            State: State,
            City: City,
        });
        if(record){
            res.status(200).json({ IsSuccess: true , Data: [record] , Message: "Mandi Added Successfully" });
            await record.save();
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Mandi Not Added" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/updateMandi", async function(req,res,next){
    const { lat , long , completeAddress , mandiId } = req.body;
    try {
        var updateIs = {
            location: {
                lat : lat,
                long : long,
                completeAddress : completeAddress,
            }
        }
        var record = await mandiSchema.findByIdAndUpdate(mandiId,updateIs);
        res.status(200).json({ IsSuccess: true , Data: 1 , Message: "Updated" });
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
                                        path: "City",
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
                                    })
                                    .populate({
                                        path: "City",
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
    const { State , City , id } = req.body;
    try {
        var record = await mandiSchema.find({ 
                                        //  State: State,
                                         City: City
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

module.exports = router;