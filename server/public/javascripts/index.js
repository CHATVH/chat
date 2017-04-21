var btn_reg = document.querySelectorAll('.button_reg')[0];
var btn_signin = document.querySelectorAll('.button_signin')[0];
var new_login = document.querySelectorAll('.new_login')[0];
var new_email = document.querySelectorAll('.email')[0];
var new_password = document.querySelectorAll('.password_reg')[0];
var login = document.querySelectorAll('.login')[0];
var password = document.querySelectorAll('.password')[0];

//Создание события по нажатию на кнопку
btn_reg.addEventListener('click',function() {
    if (new_password.value != '' & new_login.value != '' & new_email.value != '') {
        var crypt = new JSEncrypt();
        crypt.getKey();
        var keyPublic = crypt.getPublicKey();
        var keyPrivate = crypt.getPrivateKey();

        var data = {
            public_key: keyPublic,
            login: new_login.value,
            email: new_email.value,
            password: new_password.value
        };

        var xhr = new XMLHttpRequest();
        window.localStorage.setItem('keyPrivate', keyPrivate);
        window.localStorage.setItem('login', new_login.value);
        window.localStorage.setItem('email', new_email.value);
        window.localStorage.setItem('password', new_password.value);
        alert('Вы успешно зарегистрировались!');
        xhr.open('POST', '/users', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));

        document.location.href='chat';
    }
    else
        alert('Поля не заполнены!');
});

btn_signin.addEventListener('click',function() {
    if (login.value != '' & password.value != '') {
         var data = {
             login: login.value,
             password: password.value
         };
         var xhr = new XMLHttpRequest();
         xhr.open('POST', '/users/login', true);
         xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function () {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                console.log(JSON.parse(xhr.responseText));
            };
        };
         xhr.send(JSON.stringify(data));
         // if (data.login == login.value){
         //     document.location.href='chat';
         // }
         // else
         //     alert('Неправильно введены логин/пароль');
        console.log(data.login);
        console.log(data.password);
        // console.log(login);
        // console.log(password);
    }
    else
        alert('Поля не заполнены!');
});

