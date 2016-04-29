'use strict';

function getViewerURL(fileUrl) {
    return chrome.extension.getURL('viewer/viewer.html') + '?file=' + encodeURIComponent(fileUrl);
}

function contentTypeContains(contentType, string){
    if(contentType.value.indexOf(string) > -1){
        return true;
    }
    return false;
}

function isRtfFile(details) {
    var contentType = details.responseHeaders.find(function(element){
        if(element.name.toLowerCase() === 'content-type'){
            return element;
        }
        return false;
    });

    if (contentType) {
        return (contentTypeContains(contentType, 'application/rtf') ||
            contentTypeContains(contentType, 'text/rtf') ||
            (contentTypeContains(contentType, 'text/plain') && details.url.endsWith('.rtf')));
    }
}

chrome.webRequest.onHeadersReceived.addListener(
    function(details) {
        if (!isRtfFile(details)) {
            return;
        }
        return { redirectUrl: getViewerURL(details.url) };
    },
    {
        urls: ['<all_urls>'],
        types: ['main_frame', 'sub_frame']
    },
    ['blocking','responseHeaders']
);

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        return { redirectUrl: getViewerURL(details.url) };
    },
    {
        urls: ['ftp://*/*.rtf'],
        types: ['main_frame', 'sub_frame']
    },
    ['blocking']
);

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        return { redirectUrl: getViewerURL(details.url) };
    },
    {
        urls: ['file://*/*.rtf'],
        types: ['main_frame', 'sub_frame']
    },
    ['blocking']
);