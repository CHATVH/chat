var mongoose = require('mongoose');
var Scheme = mongoose.Schema;

var Room = new Scheme({
    name: {
        type: String,
        unique: true,
        require:true
    } ,
    owner_id: {
        type: String,
        require:true
    } ,
    user_id: {
        type: String,
        require:true
    } ,
    pass_phrase: {
        type: String,
        require:true
    }
});

module.exports = mongoose.model("Room", Room);
