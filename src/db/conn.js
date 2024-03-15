const mongoose = require("mongoose");
// mongoose.connect("mongodb://0.0.0.0:27017/demo")
mongoose.connect("mongodb+srv://vivekhandaindore:961QR5cXzQFfr9FT@cluster0.j0hkqu2.mongodb.net/")
.then(()=>{
    console.log("Connection Successful");
}).catch((e)=>{
    console.log("Not connected");
})
