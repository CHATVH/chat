var socket = io.connect('http://localhost:4200');
var btn = document.querySelectorAll('.button_send')[0];
var input = document.querySelectorAll('.input_message')[0];

var common_chat_list = document.querySelectorAll('.common_chat')[0];

//Создание события по нажатию на кнопку
btn.addEventListener('click', function(){
	if(!input.value.length) return false;

	socket.emit('message', {
		author: name,
		text: input.value,
		time: new Date() * -1
	});
	input.value = '';
});


socket.on('getMessage', function (data) {
	var source   = document.querySelectorAll('#template_common_chat')[0].innerHTML;
	var template = Handlebars.compile(source);
	common_chat_list.innerHTML += template(data);
});

/*

var context = {title: "My New Post", body: "This is my first post!"};
var html    = template(context);

*/

/*
var source   = $("#entry-template").html();
var template = Handlebars.compile(source);*/
