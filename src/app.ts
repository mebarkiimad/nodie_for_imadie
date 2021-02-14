import express from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/userModel'
import routes from './api/routes'
import * as socketio from "socket.io";
dotenv.config();

const app:express.Express = express();
const PORT = 3001;

interface User {
  userId:string;
  iat:number;
  exp:number;
}
const local ='mongodb://localhost:27017/local';
const uri='mongodb+srv://imaddb:imad@cluster0.22xzl.mongodb.net/imaddb?retryWrites=true&w=majority';
mongoose.connect("mongodb://iamdev:imadcasbah@104.236.41.20:27017/?authSource=admin", {useUnifiedTopology: true,dbName :"casbahdb" })
 .then((response) => {
  console.log('Connected to the Database successfully ***********************');
 }).catch((error)=>{

  console.log("Couldn't connect to the Database successfully");

 });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) =>{
  res.setHeader('Access-Control-Allow-Origin', '*');    
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');    
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');   
  res.setHeader('Access-Control-Allow-Credentials', "true");
  next();
});
const token:string='AF301B046AC6BEB3C9B964B1D6A5EB197C191163C0D9453E84EB394705CC56D9';

app.get('/casbah', (req, res) => {
  res.status(200).json({
    data: {


            "id": 1,
            "title": "casbah"
          
    }
   });

});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});
app.use(async (req, res, next) => {
  if (req.headers["x-access-token"]) {
   const accessToken = req.headers["x-access-token"] as string;

const user = await jwt.verify(accessToken, token);
const {  userId,
  iat,
  exp} = user as User;
  const _userId:string = userId
const expDate:number = exp;
   if (expDate < Date.now().valueOf() / 1000) { 
   return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
    } 

 



 res.locals.loggedInUser =  await User.findById(_userId).exec();
 
   next(); 
  } else { 
   next(); 
  } 

 });


 app.use('/', routes); 

 app.set("port",PORT);
 let http = require("http").Server(app);
 let io = require("socket.io")(http);
 // whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", (socket: any) => {
  console.log("a user connected");
  // whenever we receive a 'message' we log it out
  socket.on("message",(message: any) => {
    console.log(` From Fronted app ${message}`);

    socket.emit("message",` From nodeJS server ${message}`);
  });
});

http.listen(PORT, () => {
  console.log('Server is listening on Port:', PORT)
})