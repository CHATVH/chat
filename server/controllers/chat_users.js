var Message = require('../models/message');

module.exports = function(io) {

    io.on('connection', function(client) {
        var userNames = [];
        for(var socket in io.sockets.sockets){
            userNames.push(io.sockets.sockets[socket].handshake.query.username);
        }
        client.emit('initCommonUserList', userNames)
    });
};
