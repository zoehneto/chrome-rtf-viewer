# chrome-rtf-viewer
This chrome extension allows to view RTF (Rich Text Format) files in the browser and does so automatically when clicking any link to an RTF file. The RTF file is then automatically rendered in the same tab (similarly to the pdf preview feature of most browsers). This plugin does not depend on any external services to generate the preview.

You can install this extension from https://chrome.google.com/webstore/detail/rtf-viewer/djalaeippddcgflofefafkgijpefkjef

# Support for other browsers
This extension will be available for firefox as soon as Bug [1256122](https://bugzilla.mozilla.org/show_bug.cgi?id=1256122) is resolved.

# License
This project is licensed under the MIT license. See the LICENSE file for details.

# Dependencies
This project uses [rtf.js](https://github.com/tbluemel/rtf.js) for rendering the RTF files. rtf.js and its dependecies are included in the 'external' folder for convenience.
