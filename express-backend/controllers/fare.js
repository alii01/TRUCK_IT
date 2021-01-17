


exports.fareCalculation= async (req , res)=>{
    const {distance} =req.body;
    console.log("fare calculation");
    console.log(distance)



    fare = 50+(distance*5);

   
}; 