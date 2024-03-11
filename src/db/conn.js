const mongoose = require("mongoose");
mongoose.connect("mongodb://0.0.0.0:27017/demo")
.then(()=>{
    console.log("Connection Successful");
}).catch((e)=>{
    console.log("Not connected");
})
