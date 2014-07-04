///
/// MAIN NAMESPACE
////////////////////

EDEN = {
    TEST: "",
    LANG: {},
    STATE: {},
    CACHE: {}
};

EDEN.Login = function(){
    var e = EDEN.CACHE.email,
        p = EDEN.CACHE.pass;
    EDEN.CACHE.email = '';
    EDEN.CACHE.pw = '';

    FBR.auth.login('password', {
        email: e,
        password: p,
        rememberMe: true
    });
};

EDEN.Logout = function(){
    FBR.auth.logout();
};

EDEN.Register = function(){
    var e = EDEN.CACHE.email,
        p = EDEN.CACHE.pass;
    FBR.auth.createUser(e, p, function(error, user) {
        if (!error) {
            console.log('User Id: ' + user.uid + ', Email: ' + user.email);
            EDEN.Login();
        } else {
            console.log(error);
        }
    });
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
    shellLogin: "Please enter your email: ",
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
    shellCaret: $("#shellCaret")
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