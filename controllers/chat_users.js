var Room = require('../models/room');
var User = require('../models/user');

module.exports = function(io) {

    io.on('connection', function(client) {
        var userNames = [];
        for(var socket in io.sockets.sockets){
            userNames.push(io.sockets.sockets[socket].handshake.query.username);
        }
        io.sockets.emit('initCommonUserList', userNames);

        User.find({ username: client.handshake.query.username})
            .then(users => {
                let user = users[0];
                return Room.find({owner_id: user._id})
            })
            .then(data => {
                let rooms = data.map(item => item.name);
                client.emit('initRooms', rooms);
            })

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
