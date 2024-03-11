const express = require("express");
const mongoose = require("mongoose");

const demoSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    hobbies:{
        type:String,
        required:true,
    },
    skills:{
        type:String,
        required:true,
    }, 
    achievements:{
        type:String,
        required:true,
    }, 
    nickname:{
        type:String,
        required:true,
    },
    
})
const Demo = new mongoose.model("Demo",demoSchema);
module.exports = Demo;

// {
// "email":"vivekhanda@gmail.com",
// "hobbies":"Playing tennis",
// "skills":"Dancing",
// "achievements":"Won GDSC WOW Cloud Quiz",
// "nickname":"Honey"
// }