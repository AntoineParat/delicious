const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const StoreSchema = new Schema({
    userId : {type : String, required : true},
    name : {type : String, required : true, trim : true,},
    adresse : {type : String, required : true, trim : true, unique : true},
    // coordinates : {type : String, required : true, trim : true, unique : true},
    photos: [{type : Buffer}],
    tags : [{type : String, required : true}],
    description : {type : String, required : true, trim : true}
},
{
    timestamps : true
}
);
StoreSchema.index({name : "text"})


const Store = mongoose.model('store', StoreSchema);

module.exports = Store;