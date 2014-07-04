///
/// MAIN INITIALIZATION
//////////////////////////

$EDEN.shellInputActual.focus();

///
/// TEST BED
//////////////////////////

FBR.auth = new FirebaseSimpleLogin(FBR.base, function(error, user) {
    if(error){
        EDEN.MainShell.print(error,'red',false);
    } else if (user !== null) {
        console.log(user);
        EDEN.MainShell.print(EDEN.LANG.EN.loggedIn,'green',false);
        EDEN.STATE.loggedIn = true;
    } else if (user === null && error === null){
        EDEN.MainShell.print(EDEN.LANG.EN.loggedOut,'green',false);
        EDEN.STATE.loggedIn = false;
    }
});

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


///
/// ANGULAR STUFF
//////////////////////////
var meClient = angular.module('meClient', []);
meClient.controller('MainCtrl', function ($scope) {
    // ...
});
angular.bootstrap(document, ['meClient']);