var mongoose = require('mongoose');
var Scheme = mongoose.Schema;

var Room = new Scheme({
    name: {
        type: String,
        require:true,
        unique: false
    } ,
    owner_id: {
        type: String,
        require:true,
        unique: false
    } ,
    user_id: {
        unique: false,
        type: String,
        require:true
    } ,
    pass_phrase: {
        unique: false,
        type: String,
        require:true
    }
});

module.exports = mongoose.model("Room", Room);
