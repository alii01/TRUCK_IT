const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:false
    } ,
    lastName: {
         type:String
        
    },
    email :{
        type: String,
        required:false
    },
    password:{
        type:String,
        required:false
    }
  //  PhoneNumber:{
    //    type:String
        
    //}
});

const User= mongoose.model('User',userSchema);

module.exports= User;