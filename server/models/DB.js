var mongoose = require('mongoose');
var Scheme = mongoose.Schema;

var User = new Scheme({
    login: {
        type:String,
        unique: true,
        require:true
    } ,
    public_key: {
        type:String,
        require:true
    } ,
    password: {
        type:String,
        require:true
    },
    email: {
        type:String,
        unique: true,
        require:true
    }
});

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

var Session = new Scheme({
    token: {
        type:String,
        require:true,
        unique: true
    } ,
    time : {
        type: Date,
        require:true
    },
});

module.exports = mongoose.model("User", User);
// module.exports = mongoose.model("Session", Session);
// module.exports = mongoose.model("Room", Room);
