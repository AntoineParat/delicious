const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const AvatarSchema = new Schema({
    userId : {type : String, required : true},
    avatar: {type : Buffer},
},
{
    timestamps : true
}
);

const Avatar = mongoose.model('avatar', AvatarSchema);

module.exports = Avatar;