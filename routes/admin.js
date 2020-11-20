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
            res.status(400).json({ IsSuccess: true , Data: 0 , Message: "Not Added" });
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
        //Console.log(record.length);
        if(record){
            //await record.save();
            res.status(200).json({ IsSuccess: true , Message: "Admin LoggedIn" });
        }
        else{
            res.status(400).json({ IsSuccess: true , Message: "Not Registered" });
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
            res.status(400).json({ IsSuccess: true , Data: 0 , Message: "Not Added" });
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
            res.status(400).json({ IsSuccess: true , Data: 0 , Message: "No States Available" });
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
            res.status(400).json({ IsSuccess: true , Data: 0 , Message: "Not Added" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getCity" , async function(req,res,next){
    try {
        var record = await citySchema.find();
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "States Found" });
        }
        else{
            res.status(400).json({ IsSuccess: true , Data: 0 , Message: "No States Available" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

module.exports = router;