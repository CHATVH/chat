function callback(response){
    var profile = response.data;

    var socket = io.connect('http://localhost:4200', { query: "username="+ profile.username +"" });

    var btn = document.querySelectorAll('.button_send')[0];
    var btn_invite = document.querySelectorAll('.button_invite')[0];

    var input = document.querySelectorAll('.input_message')[0];
    var input_add_user = document.querySelectorAll('.add_users')[0];

    var message_list = document.querySelectorAll('.common_chat')[0];
    var users_list = document.querySelectorAll('.users')[0];


    var textLogin = document.querySelectorAll('.our_login')[0];
    textLogin.innerHTML = profile.user.username;


    btn.addEventListener('click', function(){
        if(!input.value.length) return false;

        var rsaEncrypt = new JSEncrypt();
        rsaEncrypt.setPrivateKey(sessionStorage.getItem('keyPrivate'));
        var simKey = rsaEncrypt.decrypt(profile.room.pass_phrase);

        var encryptMessage = CryptoJS.Rabbit.encrypt(
            input.value, simKey);


        socket.emit('messageEncrypted', {
            room_id: profile.room._id,
            text: encryptMessage.toString(),
            author: profile.user.username
        });
        input.value = '';
    });

      btn_invite.addEventListener('click', function(){
        if(!input_add_user.value.length) return false;

        new API('POST', '/api/profile', {username: input_add_user.value}, function(data){
            if(!data.success) return false;
            var rsaDecrypt = new JSEncrypt();
            var public_key_invite = data.public_key;

            rsaDecrypt.setPrivateKey(sessionStorage.getItem('keyPrivate'));

          var simKey = rsaDecrypt.decrypt(profile.room.pass_phrase);

          var rsaEncryptInvite = new JSEncrypt();
          rsaEncryptInvite.setPublicKey(public_key_invite);

          var encryptSimKey = rsaEncrypt.encrypt(simKey);

          new API('POST', '/api/invite', {username: input_add_user.value, pass_phrase: encryptSimKey}, function(data){

          });
        });

        input.value = '';
      });


    socket.on('getMessageEncrypted', function (data) {
        var rsaDecrypt = new JSEncrypt();
        rsaDecrypt.setPrivateKey(sessionStorage.getItem('keyPrivate'));
        var simKey = rsaDecrypt.decrypt(profile.room.pass_phrase);
        var decryptedMessage = CryptoJS.Rabbit.decrypt(
            data.text, simKey);

        var message = {
            author: profile.user.username,
            text: decryptedMessage.toString(CryptoJS.enc.Utf8),
            time: ''
        }

        renderMessages(message);
    });


    function renderMessages(data){
        var source   = document.querySelectorAll('#template_private_message')[0].innerHTML;
        var template = Handlebars.compile(source);
        message_list.innerHTML += template(data);
    }


    /*socket.on('getMessageEncrypted', function (data) {
        data.forEach(item => renderMessages(item));
    });

    socket.on('initCommonUserList', function (data) {
        renderUserList(data);
    });


    socket.on('getMessage', function (data) {
        renderMessages(data)
    });

    function renderRoomList(data){
        var source   = document.querySelectorAll('#template_room_list')[0].innerHTML;
        var template = Handlebars.compile(source);
        room_list.innerHTML += template({name: data});
    }
    function renderUserList(data){
        var source   = document.querySelectorAll('#template_common_chat_user_list')[0].innerHTML;
        var template = Handlebars.compile(source);
        common_chat_users_list.innerHTML = template({data: data});
    }*/
}

new API('POST', '/api/credentialsRoom', {room_name: room_name}, callback);

