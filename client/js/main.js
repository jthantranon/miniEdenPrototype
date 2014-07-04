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


///
/// ANGULAR STUFF
//////////////////////////
var meClient = angular.module('meClient', []);
meClient.controller('MainCtrl', function ($scope) {
    // ...
});
angular.bootstrap(document, ['meClient']);