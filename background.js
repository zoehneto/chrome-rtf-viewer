'use strict';

function getViewerURL() {
    return chrome.extension.getURL('viewer/viewer.html');
}

chrome.browserAction.onClicked.addListener(function(activeTab) {
    chrome.tabs.create({ url: getViewerURL() });
});