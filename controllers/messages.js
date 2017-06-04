var Message = require('../models/message');

module.exports = function(io) {

    io.on('connection', function(client) {

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

        client.on('messageEncrypted', function (data) {
            new Message(data).save()
                .then(data => io.sockets.emit('getMessageEncrypted', data))
                .catch(err => {
                    console.log('err saved encrypt message');
                    console.log(err);
            });
        });
    });
};