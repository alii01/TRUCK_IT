const User= require('../model/User');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const jwtSecret= require('../config/jwtSecret');

exports.loginUser=async (req , res)=>{
    const {email , password} =req.body;
    const user= await User.findOne({email});
    if (user){
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if (isPasswordCorrect){
            const token = jwt.sign(user.email,jwtSecret);
            return res.json({token:token});
        }else{
         //change 2:21 1/15/2021

        return res.send({token:'Password is Incorrect Please Enter again '});
        }
    }
    else{ //change 2:21 1/15/2021
    return res.send({token:'email does not exist ' });
    }
}; 
exports.createUser=async (req,res)=>{
    try {//email ,fname,lname, password,pnumber
        const {email,fname ,lname, password}= req.body;
        console.log(email)
        console.log(fname)
        if(await User.findOne({email})){
            return res.status(409).send('Account with this mail exist')
        }
        //console.log(type of(email))

        const hashedPassword = await bcrypt.hash(password ,12);
        console.log(hashedPassword);
      //  const abc='test val'

        // var user = new User({
        //     'firstName':firstName,
        //     'lastName':lastName,
        //     'email':email,
        //     'password': hashedPassword
        //    // PhoneNumber
        // });
        
        const user = new User({
            firstName: fname,
            lastName:lname,
            email:email,
            password:hashedPassword
            
                     
        });
        console.log(typeof(user))
         const result=await user.save();
         res.send('you saved a user');
    } catch(err){
        res.status(500).send(err);
    }
 };
 

exports.fareCalculation= async (req , res)=>{
    const distance =req.body;
    console.log("fare calculation");
     // parseFloat(distance.distance.substring(0,distance.distance.length -3))



    var fare = 50+(parseFloat(distance.distance.substring(0,distance.distance.length -3))*5);
    console.log(fare);
   
}; 
