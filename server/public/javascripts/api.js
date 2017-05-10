function API(method, url, data, callback){
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        //call only when request is done
        if(xhr.readyState === 4) callback(JSON.parse(xhr.responseText));
    };

    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}
