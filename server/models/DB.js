var mongoose = require('mongoose');
var Scheme = mongoose.Schema;



var Room = new Scheme({
    id: {
        type:String,
        require:true
    } ,
    name: {
        type:String,
        unique: true,
        require:true
    } ,
    owner_id: {
        type:String,
        require:true
    } ,
    pass_fraze: {
        type:String,
        require:true
    }
});


// module.exports = mongoose.model("Session", Session);
// module.exports = mongoose.model("Room", Room);
