var mongoose = require('mongoose');
var Scheme = mongoose.Schema;

var Message = new Scheme({
	room_id: {
		type:String,
		require:true
	} ,
	time : {
		type: Date,
		require:true
	},
	text: {
		type:String,
		require:true
	},
	author: {
		type: String,
		require: true
	}
});


module.exports = mongoose.model("Message", Message);
