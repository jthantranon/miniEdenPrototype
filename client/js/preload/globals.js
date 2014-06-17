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

var FBR = {};
FBR.base = new Firebase('https://minieden.firebaseio.com');
FBR.private = FBR.base.child('private');
FBR.requests = FBR.base.child('requests');
FBR.sessions = FBR.base.child('sessions');
FBR.privateUsers = FBR.private.child('users');

var FB_REF = new Firebase('https://minieden.firebaseio.com');
var REQ_REF = FB_REF.child('requests');

var FB_AUTH = new FirebaseSimpleLogin(FB_REF, function(error, user) {
    if (error) {
        // an error occurred while attempting login
        console.log(error);
    } else if (user) {
        // user authenticated with Firebase
//        console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);
        console.log(user);

        var FB_CONNECTED_REF = FB_REF.child('.info').child('connected');
        FB_CONNECTED_REF.on('value', function(data){
           var dat = data.val();
            if(dat === true){
                FBR.reqYouser = FBR.requests.child(user.uid);
                FBR.sessionsUser = FBR.sessions.child(user.uid);
                var con = FBR.sessionsUser.push(true);
                con.onDisconnect().remove();
                console.log('AUTHED........');
            }
        });

        $('#connectionUI').show();
        EDEN.cache.loggedIn = true;
        EDEN.cache.loggedIn = true;
        var scope = angular.element($("#MainCtrl")).scope();
        scope.$apply(function(){
            console.log('test');
            scope.connectionStatus = 'CONNECTED';
        });
        EDEN.cache.buffer.push('LOGGED IN.');
        EDEN.cache.fb_user = user;
        if(EDEN.AUGSHELL){
            EDEN.AUGSHELL.printBuffer();
        }

    } else {
        // user is logged out
    }
});



//var meClient = angular.module('meClient', []);