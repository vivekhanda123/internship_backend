const mongoose = require("mongoose");
require('dotenv').config();
// mongoose.connect("mongodb://0.0.0.0:27017/demo")
mongoose.connect(process.env.DB_LINK)
.then(()=>{
    console.log("Connection Successful");
}).catch((e)=>{
    console.log("Not connected");
})
