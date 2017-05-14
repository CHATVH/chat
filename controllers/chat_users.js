var Room = require('../models/room');
var User = require('../models/user');

module.exports = function(io) {

    io.on('connection', function(client) {
        var userNames = [];
        for(var socket in io.sockets.sockets){
            userNames.push(io.sockets.sockets[socket].handshake.query.username);
        }
        io.sockets.emit('initCommonUserList', userNames);


        client.on('creatingRoom', function(data){
            var room = new Room(data);

            room.save()
                .then(data => {
                    console.log(data);
                    client.emit('createdRoom', data)
                })
                .catch(err => {
                    console.log('===ERROR CREATING NEW ROOM===');
                    console.log(err);
                })
        });

        client.on('disconnect', function(){
            userNames = [];
            for(var socket in io.sockets.sockets){
                userNames.push(io.sockets.sockets[socket].handshake.query.username);
            }
            io.sockets.emit('initCommonUserList', userNames);
        });
    });
};
