/**
 * Created by John on 6/13/2014.
 */
var EDEN = {
    zIndex: {},
    state: {},
    cache: {
        buffer: []
    }
};

var FB_REF = new Firebase('https://minieden.firebaseio.com');
var FB_AUTH = new FirebaseSimpleLogin(FB_REF, function(error, user) {
    if (error) {
        // an error occurred while attempting login
        console.log(error);
    } else if (user) {
        // user authenticated with Firebase
//        console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);
        console.log(user);
        EDEN.cache.loggedIn = true;
        var scope = angular.element($("#MainCtrl")).scope();
        scope.$apply(function(){
            console.log('test');
            scope.connectionStatus = 'CONNECTED';
        });
        EDEN.cache.buffer.push('LOGGED IN.')
        EDEN.cache.fb_user = user;
        if(EDEN.AUGSHELL){
            EDEN.AUGSHELL.printBuffer();
        }

    } else {
        // user is logged out
    }
});

//var meClient = angular.module('meClient', []);