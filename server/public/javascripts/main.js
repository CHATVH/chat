var socket = io.connect('http://localhost:4200');

var input = document.querySelectorAll('.input_message')[0];
var btn = document.querySelectorAll('.button_send')[0];
var name_label = document.querySelectorAll('#chat_user')[0];

//Создание события по нажатию на кнопку
btn.addEventListener('click', function(){
    socket.emit('message', {
        name: Math.random(),
        text: input.value,
    });
});

var newLi = document.createElement('li');
newLi.innerHTML = 'Привет, мир!';

var list = document.querySelectorAll('.chat_inpute_message')[0]; //Вывод сообщение
socket.on('getMessage', function (data) {
    //name_label.text = data.name;
    var li = document.createElement('li');
    name_label.innerHTML = data.name; //передает имя юзера в #chat_user
    li.innerHTML = "<span class='list-name' style='color: rgba(14,33,35,0.79);'>"+data.name+"</span>"+" : "+"<span class='list-text'>"+data.text+"</span>";
    list.appendChild(li);
});
