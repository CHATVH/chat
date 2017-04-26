var btn_reg = document.querySelectorAll('.button_reg')[0];
var btn_signin = document.querySelectorAll('.button_signin')[0];
var new_login = document.querySelectorAll('.new_login')[0];
var new_email = document.querySelectorAll('.email')[0];
var new_password = document.querySelectorAll('.password_reg')[0];
var login = document.querySelectorAll('.login')[0];
var password = document.querySelectorAll('.password')[0];


var input_file = document.querySelectorAll('.file')[0];

input_file.addEventListener('change', function(e){
    var file = e.target.files[0];

    var reader = new FileReader();

    reader.onload = function(e) {
        var text = reader.result;
        if(text.indexOf('BEGIN RSA PRIVATE KEY') !== -1){
            sessionStorage.setItem('privateKey', reader.result)
        }else {

        }
    };
    reader.readAsText(file);

})


//Создание события по нажатию на кнопку
btn_reg.addEventListener('click',function() {
    if (new_password.value !== '' && new_login.value !== '' && new_email.value !== '') {
        var crypt = new JSEncrypt();
        crypt.getKey();
        var keyPublic = crypt.getPublicKey();
        var keyPrivate = crypt.getPrivateKey();
        var file = new File([keyPrivate], "privateKey.key", {type: "text/plain;charset=utf-8"});
        var data = {
            public_key: keyPublic,
            login: new_login.value,
            email: new_email.value,
            password: new_password.value
        };

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                saveAs(file);
                window.sessionStorage.setItem('keyPrivate', keyPrivate);
                document.location.href = 'chat';
            }
        };

        xhr.open('POST', '/users', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    }
    else
        alert('Поля не заполнены!');
});

btn_signin.addEventListener('click',function() {
    var data = {
        login: login.value,
        password: password.value
    };
    if (data.login !== '' && data.password !== '' && !!sessionStorage.getItem('privateKey')) {
         var xhr = new XMLHttpRequest();
         xhr.open('POST', '/users/login', true);
         xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function () {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                window.location.href = "/chat";
            };
        };
        xhr.send(JSON.stringify(data));

    }
    else
        alert('Поля не заполнены!');
});

