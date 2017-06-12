function callback(response) {
    var profile = response.data;

    var btn = document.querySelectorAll('.button_send')[0];
    var btn_invite = document.querySelectorAll('.button_invite')[0];

    var input = document.querySelectorAll('.input_message')[0];
    var input_add_user = document.querySelectorAll('.add_users')[0];

    var message_list = document.querySelectorAll('.common_chat')[0];
    var users_list = document.querySelectorAll('.users')[0];


    var textLogin = document.querySelectorAll('.our_login')[0];
    textLogin.innerHTML = profile.user.username;



    var socket = io.connect('http://localhost:4200', {query: "username=" + profile.user.username + "&room_id=" + profile.room.room_id});

    //init messages
    socket.emit('getAllMessages', {username: profile.username, room_id: profile.room.room_id});
    socket.on('emitAllMessages', function (data) {
        data.forEach(item => renderMessages(item));
    });

    //init list users
    socket.emit('getAllUsers', {room_id: profile.room.room_id});
    socket.on('emitAllUsers', function (data) {
        renderUserList(data);
    });

    socket.on('getMessage', function (data) {
        renderMessages(data)
    });


    function renderMessages(data) {

        var rsaDecrypt = new JSEncrypt();
        rsaDecrypt.setPrivateKey(sessionStorage.getItem('keyPrivate'));
        var simKey = rsaDecrypt.decrypt(profile.room.pass_phrase);
        var decryptedMessage = CryptoJS.Rabbit.decrypt(
            data.text, simKey);

        var message = {
            author: data.author,
            text: decryptedMessage.toString(CryptoJS.enc.Utf8),
            time: ''
        };

        var source = document.querySelectorAll('#template_private_message')[0].innerHTML;
        var template = Handlebars.compile(source);
        message_list.innerHTML += template(message);
    }
    function renderUserList(data){
        var source   = document.querySelectorAll('#template_common_chat_user_list')[0].innerHTML;
        var template = Handlebars.compile(source);
        users_list.innerHTML = template({data: data});
    }



    btn.addEventListener('click', function () {
        if (!input.value.length) return false;

        var rsaEncrypt = new JSEncrypt();
        rsaEncrypt.setPrivateKey(sessionStorage.getItem('keyPrivate'));
        var simKey = rsaEncrypt.decrypt(profile.room.pass_phrase);

        var encryptMessage = CryptoJS.Rabbit.encrypt(input.value, simKey);


        socket.emit('message', {
            room_id: profile.room.room_id,
            text: encryptMessage.toString(),
            author: profile.user.username
        });
        input.value = '';
    });

    btn_invite.addEventListener('click', function () {
        if (!input_add_user.value.length) return false;


        new API('POST', '/api/profile', {username: input_add_user.value}, function (data) {
            if (!data.success) return false;
            var rsaDecrypt = new JSEncrypt();
            var public_key_invite = data.data.public_key;

            rsaDecrypt.setPrivateKey(sessionStorage.getItem('keyPrivate'));

            var simKey = rsaDecrypt.decrypt(profile.room.pass_phrase);

            var rsaEncryptInvite = new JSEncrypt();
            rsaEncryptInvite.setPublicKey(public_key_invite);

            var encryptSimKey = rsaEncryptInvite.encrypt(simKey);

            new API('POST', '/api/invite', {
                user_id: data.data.user_id,
                room_id: profile.room.room_id,
                owner_id: profile.user.id,
                pass_phrase: encryptSimKey,
                name: profile.room.name
            }, function (data) {
                socket.emit('invite', {username: input_add_user.value});
                input_add_user.value = '';
            });
        });

    });

}

new API('POST', '/api/credentialsRoom', {room_name: room_name}, callback);

