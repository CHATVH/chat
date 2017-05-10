var mongoose = require('mongoose');
var Scheme = mongoose.Schema;

var User = new Scheme({
    username: {
        type: String,
        unique: true,
        require:true
    },
    password: {
        type: String,
        require:true
    },
    email: {
        type: String,
        unique: true,
        require:true
    },
    public_key: {
        type: String,
        require:true
    },
});

module.exports = mongoose.model("User", User);
