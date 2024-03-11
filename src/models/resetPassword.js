const express = require("express");
const { string } = require("joi");
const mongoose = require("mongoose");

const resetSchema = new mongoose.Schema({
    _id:{
        type:String,
        required:true,
    },
    new_password:{
        type:String,
        required:true,
        min:1,
        max:30,
    },
})

const Reset = new mongoose.model("Reset",resetSchema);
module.exports = Reset;