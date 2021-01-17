const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    } ,
    lastName: {
         type:String
        
    },
    email :{
        type: String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    PhoneNumber:{
        type:String,
        required:false

    },
    isDriver:{
        type:Boolean,
        required:false
    }
  //  PhoneNumber:{
    //    type:String
        
    //}
});

const User= mongoose.model('User',userSchema);

module.exports= User;