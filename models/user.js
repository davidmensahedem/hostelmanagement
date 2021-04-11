const mongoose = require("mongoose")
const Joi = require("joi")
const userSchema = new mongoose.Schema({
    name: {type:String,required: true, minLength:3,maxLength:255},
    email: {type:String,required: true},
    password: {type:String,required: true, minLength:3,maxLength:255}
});

const User = mongoose.model("User",userSchema);


const validateUser = function (user) {
    const schema = Joi.object({
        name:Joi.string().min(3).required().label("Name"),
        email:Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password")
    });

    return schema.validate(user);

}


module.exports.User = User;
module.exports.validateUser = validateUser;

