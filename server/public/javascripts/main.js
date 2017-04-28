var socket = io.connect('http://localhost:4200');


var name_label = document.querySelectorAll('#chat_user')[0];



var list = document.querySelectorAll('.chat_inpute_message')[0]; //Вывод сообщение
socket.on('getMessage', function (data) {
    if (data.text != '') {

        var li = document.createElement('li');
        name_label.innerHTML = data.name; //передает имя юзера в #chat_user
        li.innerHTML = "<span class='list-name' style='color: rgba(14,33,35,0.79);'>" + data.name + "</span>" + " : " + "<span class='list-text'>" + data.text + "</span>";
        list.appendChild(li);

        var crypt = new JSEncrypt();
        crypt.getKey();
        var keyPublic = crypt.getPublicKey();
        var keyPrivate = crypt.getPrivateKey();
        //Создание случайного симметричного ключа
       var simKey = CryptoJS.lib.WordArray.random(48).toString();
        console.log("Симметричный ключ: " + simKey);

        // Шифрование текста симметричным ключем
        console.log("Текст: " + data.text);
       var encFileWordArray = CryptoJS.Rabbit.encrypt(
            data.text, simKey);
       console.log("Зашифрованный текст: " + encFileWordArray);


        //Шифрование симметричного ключа ассиметричным
        var rsaEncrypt = new JSEncrypt();
        var encryptSimKey = "";
        rsaEncrypt.setPublicKey(keyPublic);
        encryptSimKey = rsaEncrypt.encrypt(simKey);
        console.log("Ассиметричный ключ: " + encryptSimKey);

       //encryptSimKey + шифрованный текст на сервер
       //
        //Расшифровка ассиметричного ключа
        var rsaDecrypt = new JSEncrypt();
        rsaDecrypt.setPrivateKey(keyPrivate);
        simKey = rsaDecrypt.decrypt(encryptSimKey);
        console.log("Симметричный расшифрованный ключ: " + simKey);

        //Расшифровка сообщения
            var decryptedFile = CryptoJS.Rabbit.decrypt(
                encFileWordArray, simKey);
        console.log("Расшифрованный текст: " + decryptedFile.toString(CryptoJS.enc.Utf8));
    }

    var keyPublic2 = crypt.getPublicKey();
    var keyPrivate2 = crypt.getPrivateKey();

    //Расшифровка ассиметричного ключа юзером 1
    var rsaDecrypt = new JSEncrypt();
    rsaDecrypt.setPrivateKey(keyPrivate);
    simKey = rsaDecrypt.decrypt(encryptSimKey);
    console.log("Симметричный расшифрованный ключ: " + simKey);

    //2рой юзер отправляет первому свой publickey
    console.log("PublicKey 2-рого юзера" + keyPublic2);

    //1-ый шифрует с помощью этого ключа свой simKey
    //Шифрование симметричного ключа публичным ключом 2-рого юзера
    var rsaEncrypt = new JSEncrypt();
    var encryptSimKey = "";
    rsaEncrypt.setPublicKey(keyPublic2);
    encryptSimKey = rsaEncrypt.encrypt(simKey);
    console.log("Ассиметричный ключ (зашифрованный пуб.ключом 2-рого юзера: " + encryptSimKey);

    //Передача зашифрованного simKey 2-рому юзеру.

    //действия второго юзера
    //Расшифровка ассиметричного ключа от первого юзера
    var rsaDecrypt = new JSEncrypt();
    rsaDecrypt.setPrivateKey(keyPrivate2);
    simKey = rsaDecrypt.decrypt(encryptSimKey);
    console.log("Симметричный расшифрованный ключ: " + simKey);

    //Расшифровка сообщения
    var decryptedFile = CryptoJS.Rabbit.decrypt(
        encFileWordArray, simKey);
    console.log("Расшифрованный текста 2-рым юзером: " + decryptedFile.toString(CryptoJS.enc.Utf8));
    console.log("-------------------------------------------");
    console.log("-------------------------------------------");
});
