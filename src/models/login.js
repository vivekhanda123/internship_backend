const mongoose = require("mongoose");
const express = require("express");

const loginSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    }
})

const Login = new mongoose.model("Login",loginSchema);
module.exports = Login;

// {
// "email":"vivekhanda@gmail.com",
// "password":"123",
// }