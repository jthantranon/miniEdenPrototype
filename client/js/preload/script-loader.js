//////////////////////////////////////////////////////////////////////////
/// MANUAL FILE MANIFEST.
/// Files added to directory will load automagically if using App Engine,
/// else if statically servered, you must add each file manually below.
var MAN_JS_FILES = [
    'AUGSHELL',
    'GLASSCOMPS',
    'LAB-debug.min'
];

var MAN_POST_JS_FILES = [
    'init'
];

var MAN_CSS_FILES = [
    'console',
    'glass'
];

//////////////////////////////////////////////////////
/// Prepends & Appends directory and extension.
/// ex: "js/" + file name + ".js"
var manJSFilesLength = MAN_JS_FILES.length;
for (var i = 0; i < manJSFilesLength; i++){
    MAN_JS_FILES[i] = "js/" + MAN_JS_FILES[i] + ".js"
}

var manJSPostFilesLength = MAN_POST_JS_FILES.length;
for (var i = 0; i < manJSPostFilesLength; i++){
    MAN_POST_JS_FILES[i] = "js/postload/" + MAN_POST_JS_FILES[i] + ".js"
}

for (var i = 0,l = MAN_CSS_FILES.length;i < l; i++){
    MAN_CSS_FILES[i] = "css/" + MAN_CSS_FILES[i] + ".css"
}


////////////////////////////////////////////////////////////////////////////
/// CHECKING LOAD METHOD
/// Checks for automagical list, else uses manual list.

if(!JS_FILES){
    var JS_FILES = MAN_JS_FILES;
    var JS_POST_FILES = MAN_POST_JS_FILES;
    var CSS_FILES = MAN_CSS_FILES;
}

////////////////////////////////////////////////////////////////////////////
/// LOADS FILES VIA LAB
// Create a new YUI instance and populate it with the required modules.
YUI().use('get', function (Y) {
    Y.Get.css(CSS_FILES, function (err) {
    if (err) {
        Y.Array.each(err, function (error) {
            Y.log('Error loading CSS: ' + error.error, 'error');
        });
        return;
    }

    Y.log('All CSS files loaded successfully!');
});
});


$LAB
    .script(JS_FILES)
    .script(JS_POST_FILES)
;