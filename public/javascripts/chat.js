function callback(response){
    var profile = response.data;

    var btn = document.querySelectorAll('.button_send')[0];
    var input = document.querySelectorAll('.input_message')[0];

    var common_chat_list = document.querySelectorAll('.common_chat')[0];
    var common_chat_users_list = document.querySelectorAll('.users')[0];

    var name_create_new_room = document.querySelectorAll('.create_new_room__name')[0];
    var btn_create_new_room = document.querySelectorAll('.create_new_room_btn')[0];

    var room_list = document.querySelectorAll('.rooms_list')[0];

    var textLogin = document.querySelectorAll('.our_login')[0];
    textLogin.innerHTML = profile.username;


    var socket = io.connect('http://localhost:4200', { query: "username="+ profile.username +"&room_id=1" });

    //init messages
    socket.emit('getAllMessages', {username: profile.username, room_id: 1});
    socket.on('emitAllMessages', function (data) {
        data.forEach(item => renderMessages(item));
    });

    //init list users
    socket.emit('getAllUsers', {room_id: 1});
    socket.on('emitAllUsers', function (data) {
        renderUserList(data);
    });

    //init list of rooms
    socket.emit('getAllRooms', {username: profile.username});
    socket.on('emitAllRooms', function (data) {
        data.forEach(item => renderRoomList(item));
    });




    btn.addEventListener('click', function(){
        if(!input.value.length) return false;
        socket.emit('message', {
            author: profile.username,
            text: input.value
        });
        input.value = '';
    });

    btn_create_new_room.addEventListener('click', function(){
        if(!name_create_new_room.value.length) return false;
        var simKey = CryptoJS.lib.WordArray.random(48).toString();
        var rsaEncrypt = new JSEncrypt();
        rsaEncrypt.setPublicKey(profile.public_key);
        var pass_phrase = rsaEncrypt.encrypt(simKey);

        socket.emit('creatingRoom', {
            owner_id: profile.id,
            user_id: profile.id,
            pass_phrase: pass_phrase,
            name: name_create_new_room.value,
            room_id: CryptoJS.lib.WordArray.random(8).toString()
        });
        name_create_new_room.value = '';
    });




    socket.on('createdRoom', function(data){
        renderRoomList(data.name);
    });
    socket.on('getMessage', function (data) {
        renderMessages(data)
    });



    function renderMessages(data){
        var source   = document.querySelectorAll('#template_common_chat')[0].innerHTML;
        var template = Handlebars.compile(source);
        common_chat_list.innerHTML += template(data);
    }
    function renderRoomList(data){
        var source   = document.querySelectorAll('#template_room_list')[0].innerHTML;
        var template = Handlebars.compile(source);
        room_list.innerHTML += template({name: data});
    }
    function renderUserList(data){
        var source   = document.querySelectorAll('#template_common_chat_user_list')[0].innerHTML;
        var template = Handlebars.compile(source);
        common_chat_users_list.innerHTML = template({data: data});
    }
}

new API('POST', '/api/credentials', {}, callback);

