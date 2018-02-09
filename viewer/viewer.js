class Rtf {
    constructor(name, data) {
        this.name = name;
        this.data = data;
    }
}

class Viewer {
    constructor(rtf){
        this.rtf = rtf;
        document.getElementById("download").addEventListener("click", event => this._downloadRtfFile(event));
    }

    _stringToBinaryArray(string) {
        var buffer = new ArrayBuffer(string.length);
        var bufferView = new Uint8Array(buffer);
        for (var i=0; i<string.length; i++) {
            bufferView[i] = string.charCodeAt(i);
        }
        return buffer;
    }

    renderDocument(){
        try {
            RTFJS.loggingEnabled = false;
            WMFJS.loggingEnabled = false;
            EMFJS.loggingEnabled = false;
            var doc = new RTFJS.Document(this._stringToBinaryArray(this.rtf.data));

            //Set title if meta data available
            var meta = doc.metadata();
            if(meta.title && meta.title.trim() !== ""){
                document.title = meta.title;
            }else{
                document.title = this.rtf.name;
            }

            //Display document
            var mainElement = $("#main").empty();
            var renderedElements = doc.render();
            renderedElements.forEach(function(renderedElement){
                mainElement.append(DOMPurify.sanitize(renderedElement[0], {SAFE_FOR_JQUERY: true}));
            });
        }catch (error) {
            if (error instanceof RTFJS.Error || error instanceof WMFJS.Error || error instanceof EMFJS.Error) {
                $("#main").text("Error: " + error.message);
                console.error(error);
            } else {
                throw error;
            }
        }
    }

    _downloadRtfFile(event){
        var blob = new Blob([this.rtf.data], {type: "text/rtf"});
        var url = URL.createObjectURL(blob);
        var a = event.target;
        a.href = url;
        a.download = this.rtf.name;
    }
}


function loadDataXhr(){
    var rtfUrl = decodeURIComponent(location.search.replace("?file=",""));
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
                const rtf = new Rtf(rtfUrl.substring(rtfUrl.lastIndexOf("/") + 1), xhr.responseText)

                //Render document
                const viewer = new Viewer(rtf);
                viewer.renderDocument();
            } else{
                $("#main").text("Error: File not Found");
            }
        }
    };
    xhr.send();
}

function loadDataFileReader(file){
    let reader = new FileReader();
    reader.onload = function(event) {
        const rtf = new Rtf(file.name, event.target.result);

        //Render document
        const viewer = new Viewer(rtf);
        viewer.renderDocument();
    };
    reader.readAsText(file);
}


document.addEventListener('DOMContentLoaded', function(){
    if(location.search.startsWith("?file=")) {
        document.getElementById("main").classList.remove("hidden");
        document.getElementById("toolbar").classList.remove("hidden");
        loadDataXhr();
    } else {
        document.getElementById("file-upload").classList.remove("hidden");

        document.getElementById("upload-field").addEventListener("change", function () {
            document.getElementById("file-upload").classList.add("hidden");
            document.getElementById("main").classList.remove("hidden");
            document.getElementById("toolbar").classList.remove("hidden");
            loadDataFileReader(this.files[0])
        }, false)
    }
}, true);