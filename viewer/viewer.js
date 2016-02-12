function stringToBinaryArray(string) {
    var buffer = new ArrayBuffer(string.length);
    var bufferView = new Uint8Array(buffer);
    for (var i=0; i<string.length; i++) {
        bufferView[i] = string.charCodeAt(i);
    }
    return buffer;
}

function renderDocument(data){
    try {
        var doc = new RTFJS.Document(stringToBinaryArray(data));

        //Set title if meta data available
        var meta = doc.metadata();
        if(meta.title !== undefined && meta.title !== ""){
            document.title = meta.title;
        }

        //Display document
        $("#main").empty().append(doc.render());
    }catch (error) {
        if (error instanceof RTFJS.Error) {
            $("#main").text("Error: " + error.message);
        } else {
            throw error;
        }
    }
}

function loadData(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", decodeURIComponent(window.location.search.replace("?file=","")), true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            renderDocument(xhr.responseText);
        }
    };
    xhr.send();
}

document.addEventListener('DOMContentLoaded', loadData, true);