///
/// MAIN NAMESPACE
////////////////////

EDEN = {
    TEST: "",
    LANG: {},
    STATE: {},
    CACHE: {
        pass: null,
        email: null
    },
    WIDGETS: {}
};



EDEN.STATE.Caret = function (mod){
    var r;
    if(EDEN.STATE.prompt || (mod === false)){
        r = '';
    } else {
        r = '> ';
    }
    return r;
};

/// LANGUAGE
EDEN.LANG = {
    EN: {},
    TH: {}
};

EDEN.LANG.EN = {
    shellHelp: "There is no help... yet.",
    shellEmail: "Please enter your email: ",
    shellPassword: "Please enter your password: ",
    commandNotRecognized: "Error: Command not recognized.",
    loggingOut: "Logging out, stand by...",
    loggedOut: "Logged out.",
    alreadyLoggedOut: "You're not logged in.",
    alreadyLoggedIn: "You're laready logged in!",
    loggingIn: "Logging in, hang tight...",
    loggedIn: "Logged in."
};

var LANG = "EN";

///
/// DOCUMENT OBJECT MODEL & JQUERY GLOBALS
///////////////////////////////////////////

$EDEN = {
    curtain: $("#curtain"),
    backstage: $("#backstage"),
    shellInputActual: $("#shellInputActual"),
    shellInputDisplay: $("#shellInputDisplay"),
    shellCaret: $("#shellCaret"),
    primerGlass: $("#glassPrimer")
};


///
/// FIREBASE REFS
/////////////////////////

var FBR = {};
FBR.base = new Firebase('https://minieden.firebaseio.com');
FBR.public = FBR.base.child('public');
FBR.private = FBR.base.child('private');
FBR.requests = FBR.base.child('requests');
FBR.sessions = FBR.base.child('sessions');
FBR.privateUsers = FBR.private.child('users');

