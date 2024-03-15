const mongoose = require("mongoose");
// mongoose.connect("mongodb://0.0.0.0:27017/demo")
mongoose.connect(process.env.DB)
.then(()=>{
    console.log("Connection Successful");
}).catch((e)=>{
    console.log("Not connected");
})
