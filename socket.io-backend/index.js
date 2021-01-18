
const express = require("express");
const app= express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port = 3000;

let taxiSocket = null;
let passengerSocket = null;

io.on("connection" ,socket =>{
    console.log("a user is connected xD")
    
    socket.on("taxiRequest",routeResponse=>{
       // console.log(routeResponse);
       passengerSocket=socket;
       console.log("Someone is looking for a taxi");
        if(taxiSocket!=null){
            console.log(routeResponse);
            taxiSocket.emit("taxiRequest",routeResponse);
        }
        
    });
    socket.on("driverLocation",(driverLocation)=>{
        passengerSocket.emit("driverLocation",driverLocation);
    });
    socket.on("lookingForPassenger",()=>{
        console.log("someone is looking for a passenger");
        taxiSocket=socket;
    });
});


server.listen(port,()=>console.log("server running on port"+port));



