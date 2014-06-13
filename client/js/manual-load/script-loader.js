//////////////////////////////////////////////////////////////////////////
/// MANUAL FILE MANIFEST.
/// Files added to directory will load automagically if using App Engine,
/// else if statically servered, you must add each file manually below.

//var VENDOR_FILES = [
//    "//yui.yahooapis.com/3.17.2/build/yui/yui-min.js",
//    "//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js",
//    "//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js",
//    "//ajax.googleapis.com/ajax/libs/angularjs/1.2.17/angular.min.js",
//    "//cdn.firebase.com/js/client/1.0.5/firebase.js",
//    "//cdn.firebase.com/libs/angularfire/0.7.0/angularfire.js",
//    "//cdn.firebase.com/js/simple-login/1.5.0/firebase-simple-login.js"
//];

var MAN_JS_PRE_FILES = [
    'globals',
    'LAB-debug.min'
];

var MAN_JS_FILES = [
    'client',
    'shell',
    'glass',
    'shell-api',
];

var MAN_POST_JS_FILES = [
    'init'
];

var MAN_CSS_FILES = [
    'console',
    'glass',
    'main'
];

//////////////////////////////////////////////////////
/// Prepends & Appends directory and extension.
/// ex: "js/" + file name + ".js"
var manJSPreFilesLength = MAN_JS_PRE_FILES.length;
for (var i = 0; i < manJSPreFilesLength; i++){
    MAN_JS_PRE_FILES[i] = "js/preload/" + MAN_JS_PRE_FILES[i] + ".js"
}

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
    var JS_PRE_FILES = MAN_JS_PRE_FILES;
    var JS_FILES = MAN_JS_FILES;
    var JS_POST_FILES = MAN_POST_JS_FILES;
    var CSS_FILES = MAN_CSS_FILES;
}

////////////////////////////////////////////////////////////////////////////
/// LOADS FILES VIA LAB
// Create a new YUI instance and populate it with the required modules.

$LAB
    .script("//yui.yahooapis.com/3.17.2/build/yui/yui-min.js").wait()
    .script("js/manual-load/css-loader.js")
    .script("//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js")
    .script("//ajax.googleapis.com/ajax/libs/angularjs/1.2.17/angular.min.js")
    .script("//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.10/angular-route.min.js")
    .script("//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js")
    .script("//cdn.firebase.com/js/client/1.0.5/firebase.js")
    .script("//cdn.firebase.com/libs/angularfire/0.7.0/angularfire.js")
    .script("//cdn.firebase.com/js/simple-login/1.5.0/firebase-simple-login.js")
    .script(JS_PRE_FILES)
    .script(JS_FILES)
    .script(JS_POST_FILES)
;

