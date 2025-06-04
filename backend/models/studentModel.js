const mongoose = require('mongoose');
const userSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: [true , "name is req"]
        },
        email:{
            type: String,
            required: [true , "email is req"],
            unique: true
        },
        password:{
            type: String,
            required: [true , "password is req"],
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User" , userSchema)