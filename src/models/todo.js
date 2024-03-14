const mongoose = require("mongoose");
const express = require("express");

const todoSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    taskName:{
        type:String,
        required:true,
    }, 
    status:{
        type:String,
        enum:["Done","Pending","InProgress"],
        default:"Pending",
    }, 
    dateAssigned:{
        type:Date,
        required:true,
    },
    dateFrom:{
        type:Date,
        required:true,
    }, 
    dateTo:{
        type:Date,
        required:true,
    },
})

const Todo = new mongoose.model("Todo",todoSchema);
module.exports = Todo;

// {
// "userId":1,
// "taskName":"Car washing",
// "status":"Pending",
// "dateAssigned":2 Feb 2020,
// "dateFrom":5 Feb 2020,
// "dateTo":10 Feb 2020,
// }