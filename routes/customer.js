var express = require('express');
var router = express.Router();
var customerSchema = require('../model/customerModel');
var config = require('../config')
const mongoose = require("mongoose");

router.post("/register" , async function(req,res,next){
    const { name , mobile , lat , long , completeAddress , landSizeOwned , state , city } = req.body;
    try {
        var record = await new customerSchema({
            name: name,
            mobile: mobile,
            location:{
                lat: lat,
                long: long,
                completeAddress: completeAddress,
            },
            landSizeOwned: landSizeOwned,
            state: state,
            city: city,
        });
        let data = record.save();
        console.log(record);
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "User Register Successfully" });
        }else{
            res.status(400).json({ IsSuccess: true , Data: 0 , Message: "Registration Failed" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/login" , async function(req,res,next){
    const { mobile } = req.body;
    try {
        var record = await customerSchema.find({ mobile: mobile });
        if(record.length==1){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "User LoggedIn" });
        }
        else{
            res.status(400).json({ IsSuccess: true , Data: 0 , Message: "This Mobile Number not Register" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

module.exports = router;
