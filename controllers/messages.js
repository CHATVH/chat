var Room = require('../models/room');
var User = require('../models/user');
var Message = require('../models/message');

module.exports = function (io) {

    io.on('connection', function (client) {

        //init messages
        client.on('getAllMessages', function (data) {
            const room_id = data.room_id || 1; // 1 by common room
            Message.find({room_id: room_id})
                .then(data => client.emit('emitAllMessages', data))
                .catch(err => {
                    console.log('=========');
                    console.log(err);
                });
        });

        //init user list
        client.on('getAllUsers', function (data) {
            let userNames = [];
            let clients = [];

            for(var socket in io.sockets.sockets){
                if(io.sockets.sockets[socket].handshake.query.room_id == data.room_id){
                    userNames.push(io.sockets.sockets[socket].handshake.query.username);
                    clients.push(io.sockets.sockets[socket]);
                }
            }
            clients.forEach(client => client.emit('emitAllUsers', userNames));
        });
        client.on('disconnect', function(){
            //update list users when user live chat room
            const room_id = client.handshake.query.room_id;
            const user_name = client.handshake.query.username;
            let clients = [];
            let userNames = [];

            for(var socket in io.sockets.sockets){
                if(io.sockets.sockets[socket].handshake.query.room_id == room_id
                    && io.sockets.sockets[socket].handshake.query.username !== user_name){
                    userNames.push(io.sockets.sockets[socket].handshake.query.username);
                    clients.push(io.sockets.sockets[socket])
                };
            }
            clients.forEach(client => client.emit('emitAllUsers', userNames));
        });


        //init rooms list
        client.on('getAllRooms', function (data) {
            const user_name = data.username || '';
            User.find({ username: user_name})
                .then(users => {
                    let user = users[0];
                    return Room.find({user_id: user._id})
                })
                .then(data => {
                    let rooms = data.map(item => item.name);
                    client.emit('emitAllRooms', rooms);
                });
        });



        client.on('creatingRoom', function(data){
            let room = new Room(data);
            room.save()
                .then(data => {
                    client.emit('createdRoom', data)
                })
                .catch(err => {
                    console.log('===ERROR CREATING NEW ROOM===');
                    console.log(err);
                })
        });




        client.on('message', function (data) {
            data.room_id = data.room_id || 1;
            new Message(data).save()
                .then(data => {
                    let clients = [];
                    for(var socket in io.sockets.sockets){
                        if(io.sockets.sockets[socket].handshake.query.room_id == data.room_id){
                            clients.push(io.sockets.sockets[socket])
                        };
                    }
                    clients.forEach(client => client.emit('getMessage', data));
                })
                .catch(err => {
                    console.log('err saved message');
                    console.log(err);
                });
        });


        //init rooms list
        client.on('invite', function (data) {
            const user_name = data.username || '';
            User.find({ username: user_name})
                .then(users => {
                    let user = users[0];
                    console.log(user);
                    return Room.find({user_id: user._id})
                })
                .then(data => {
                    let rooms = data.map(item => item.name);
                    for(var socket in io.sockets.sockets){
                        if(io.sockets.sockets[socket].handshake.query.username == user_name){
                            io.sockets.sockets[socket].emit('emitAllRooms', rooms);
                        }
                    }
                });
        });
    });
};