/*
 * Global Objects
 */
var rtfData = {
    name: "",
    data: ""
};



/*
 * Document display functions
 */
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
        RTFJS.loggingEnabled = false;
        WMFJS.loggingEnabled = false;
        EMFJS.loggingEnabled = false;
        var doc = new RTFJS.Document(stringToBinaryArray(data));

        //Set title if meta data available
        var meta = doc.metadata();
        if(meta.title && meta.title.trim() !== ""){
            document.title = meta.title;
        }else{
            document.title = rtfData.name;
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
    var rtfUrl = decodeURIComponent(window.location.search.replace("?file=",""));
    var xhr = new XMLHttpRequest();
    xhr.open("GET", rtfUrl, true);
    xhr.onreadystatechange = function() {
        if(xhr.readyState < 4) {
            $("#main").text("Loading ...");
        }
        if (xhr.readyState == 4) {
            //XHR requests for local files (file://) don't have a status
            if ((xhr.status == 0 || (xhr.status >= 200 && xhr.status < 300))
                && xhr.responseText && xhr.responseText != "") {
                //Save data for later use
                rtfData.name = rtfUrl.substring(rtfUrl.lastIndexOf("/") + 1);
                rtfData.data = xhr.responseText;

                //Render document
                renderDocument(xhr.responseText);
            } else{
                $("#main").text("Error: File not Found");
            }
        }
    };
    xhr.send();
}



/*
 * Toolbar functionality
 */
function downloadRtfFile(event){
    var blob = new Blob([rtfData.data], {type: "text/rtf"});
    var url = URL.createObjectURL(blob);
    var a = event.target;
    a.href = url;
    a.download = rtfData.name;
}



/*
 * Event listeners
 */
document.addEventListener('DOMContentLoaded', function(){
    document.getElementById("download").addEventListener("click", downloadRtfFile);
    loadData();
}, true);