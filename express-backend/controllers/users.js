const User= require('../model/User');
const bcrypt = require('bcrypt');





exports.getUser=async (req ,res)=>{
    const usersFromDB= await User.find({});
    const users= usersFromDB.map(({email,firstName,lastName})=>({
        
            email,
            firstName,
            lastName
        
    })
    );
    return res.json(users);
};

