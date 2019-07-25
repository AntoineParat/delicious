const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CommentaireSchema = new Schema({
    userId : {type : String, required : true},
    userName : {type : String, required : true},
    restaurantId : {type : String, required : true},
    restaurantName : {type : String, required : true},
    rank : {type : Number, required : true},
    commentaire : {type : String, required : true},
    date : {type :String, required : true}
},
{
    timestamps : true
}
);

const Commentaire = mongoose.model('commentaire', CommentaireSchema);

module.exports = Commentaire;