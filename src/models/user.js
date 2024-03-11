const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User Schemas
const userSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required:true,
        trim:true,
    },
    second_name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    dob:{
        type:Date,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    phone_number:{
        type:Number,
        required:true,
    },
    password:{
        type:String,
        required:true,
        max: 100,
        min: 2,
    },
    status:{
        type:String,
        enum : ["active","inactive"],
        default:"inactive",
    },
})

// Hashing password code 
userSchema.pre("save",async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,12);
    }
    next();
})

// This is a collection 
const User = new mongoose.model("User",userSchema);
module.exports = User;

// {
// "first_name": "Ramu ",
// "second_name": "Kaka",
// "email": "ramukaka@gmail.com",
// "dob": 23 Sept 2009,
// "city": "Indore"
// "country": "India"
// "address": "21, Patel nagar"
// "phone_number": 8967456345,
// "password": "@",
// "status": "active",
// }