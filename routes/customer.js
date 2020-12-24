var express = require('express');
var router = express.Router();
var customerSchema = require('../model/customerModel');
var config = require('../config')
const mongoose = require("mongoose");
const e = require('express');

router.post("/register" , async function(req,res,next){
    const { name, mobile, lat, long, completeAddress, landSizeOwned, state } = req.body;
    try {
        let existData = await customerSchema.find({ mobile: mobile });
        if(existData.length == 1){
            res.status(200).json({ IsSuccess: true , Message: "User Already Exist" });
        }else{
            var record = await new customerSchema({
                name: name,
                mobile: mobile,
                location:{
                    lat: lat,
                    long: long,
                    completeAddress: completeAddress,
                },
                landSizeOwned: landSizeOwned,
                state: state
            });
            record.save();
            console.log(record);
            if(record){
                res.status(200).json({ IsSuccess: true , Data: record , Message: "User Register Successfully" });
            }else{
                res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Registration Failed" });
            }
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/login" , async function(req,res,next){
    const { mobile } = req.body;
    try {
        var record = await customerSchema.find({ mobile: mobile })
                                         .populate({
                                             path: "state"
                                         });
        if(record.length==1){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "User LoggedIn" });
        }
        else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "This Mobile Number not Register" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getUsers", async function(req,res,next){
    try {
        var record = await customerSchema.find()
                                         .populate("state");
        if(record){
            res.status(200).json({ IsSuccess: true , Count: record.length , Data: record , Message: "Users Found" });
        }
        else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Empty Users List" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

module.exports = router;
