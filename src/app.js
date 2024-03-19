const express = require("express");
const app = express();
require("../src/db/conn");
require("dotenv").config();
const port = process.env.PORT || 8000;
// const socketIO = require("socket.io");
const router = require("../src/routes/main");
const cookieParser = require("cookie-parser"); //extract info/data from cookie
const bodyParser = require("body-parser") // parsing incoming request in bodies
const cors = require("cors"); //front-end client can make requests for resources from backend 

app.use(cors({origin:true}));
app.use(bodyParser.json());

app.use(express.json()); // understands json files 
app.use(cookieParser()); // understands cookies 
app.use(router);

app.listen(port,()=>{
    console.log(`Connection is live at ${port}`);
})
