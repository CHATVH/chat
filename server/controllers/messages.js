var Message = require('../models/message');

module.exports = function(io) {

    io.on('connection', function(client) {
        console.log('======');
        console.log(client.handshake.query.username);
        console.log('======');



        Message.find({ room_id: 1})
            .then(data => client.emit('initCommonChat', data))
            .catch(err => {
                console.log('=========');
                console.log(err);
            });

        client.on('message', function (data) {
            data.room_id = 1;
            new Message(data).save()
                .then(data => io.sockets.emit('getMessage', data))
                .catch(err => {
                    console.log('err saved message');
                    console.log(err);
                });
        });
    });
};
