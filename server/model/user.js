const mongoose = require('mongoose');
const bcrypt =require('bcryptjs');
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema;
const UserSchema = new Schema(
    {
        name : {type : String, required : false, trim : true, unique : true},
        age : {type : Number, validate (value) { // setup a custom validator
            if(value < 0) {throw ('l\'age doit être supérieur à 0')}
        }},
        phone : {type : String},
        email : {type : String, required : true, minlength : [6], unique : true, trim : true, lowercase : true },
        password : {type : String, required : true, minlength : [8], trim : true},   
        avatar : {type : Buffer},
    },
    {
        timestamps : true
    } 
);

//Hash password before saving user with middleware
UserSchema.pre('save', async function (next) {// must not use arrow function because of 'this' binding
    //'this' means 'document'
    if(this.isModified('password')) { // it will be true when password creation and update
        const hashedPassword = await bcrypt.hash(this.password, 8);
        this.password = hashedPassword;
        console.log('passord (re)set')
    }
     next()
})

 //Find user to login
 UserSchema.statics.findByCredentials = async (mail, password) => { // .statics is applied on global Schema
    const user = await User.findOne({email : mail});
    if(!user) {
        throw new Error('unable to login')
    }
    const checkPass = await bcrypt.compare(password, user.password)
    if(!checkPass) {
        throw new Error('unable to login')
    }
    return user
}

//generate token when login
UserSchema.methods.generateToken = async function () { //.methods is applied on individual instance
    const token = await jwt.sign({ _id : this._id}, process.env.JWT_SECRET, { expiresIn : '12h'});
    await this.save()
    return token
 }


const User = mongoose.model('user', UserSchema);

module.exports = User