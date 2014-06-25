/**
 * Created by John on 6/13/2014.
 */
var EDEN = {
    zIndex: {},
    state: {},
    cache: {
        buffer: []
    },
    seshRef: null,
    gridSelect: {}
};

EDEN.$SCOPE = null;
EDEN.combo = null;
EDEN.comboCount = 0;
EDEN.resource = 0;

var FBR = {};
FBR.base = new Firebase('https://minieden.firebaseio.com');
FBR.public = FBR.base.child('public');
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
                FBR.pubYouser = FBR.public.child('users').child(user.uid);
                FBR.reqYouser = FBR.requests.child(user.uid);
//                FBR.sessionsYouser = FBR.sessions.child(user.uid);
//                var con = FBR.sessionsYouser.push(true);
                EDEN.seshRef = FBR.sessions.push(user.uid);
                EDEN.seshRef.onDisconnect().remove();
                console.log('AUTHED........');

                FBR.pubYouser.on('value',function(data){
                    var dat = data.val();
                    if(dat){
                        EDEN.$SCOPE = EDEN.$SCOPE || angular.element($("#MainCtrl")).scope();
                        EDEN.$SCOPE.$apply(function(){
                            EDEN.$SCOPE.combo = dat.combo;
                            EDEN.$SCOPE.comboCount = dat.comboCount;
                            EDEN.$SCOPE.comboScore = dat.comboCount*EDEN.comboCount;
                            EDEN.$SCOPE.resource = dat.resource;
                        });
                    }
                });


            }
        });

        $('#connectionUI').show();
        EDEN.cache.loggedIn = true;
        EDEN.cache.loggedIn = true;

        EDEN.$SCOPE = EDEN.$SCOPE || angular.element($("#MainCtrl")).scope();
        EDEN.$SCOPE.$apply(function(){
            EDEN.$SCOPE.connectionStatus = 'CONNECTED';
        });
        EDEN.cache.buffer.push('LOGGED IN.');
        EDEN.cache.fb_user = user;
        if(EDEN.AUGSHELL){
            EDEN.AUGSHELL.printBuffer();
        }

    } else {
        console.log('LOGGED OUTTTT');
        EDEN.seshRef.remove();
    }
});
EDEN.Keys = {};
EDEN.keybindLegend = {
    87: 'w',
    65: 'a',
    83: 's',
    68: 'd',
    81: 'q',
    69: 'e',
    97: 'num1',
    98: 'num2',
    99: 'num3',
    100: 'num4',
    101: 'num5',
    102: 'num6',
    103: 'num7',
    104: 'num8',
    105: 'num9'
};
EDEN.numCoord = {
    97: [2,0],
    98: [2,1],
    99: [2,2],
    100: [1,0],
    101: [1,1],
    102: [1,2],
    103: [0,0],
    104: [0,1],
    105: [0,2]
};

$(window).on('keydown', function(e){
//    EDEN.Keys[EDEN.keybindLegend[e.which]] = true; // not needed until holding down keys is important

//    console.log('you pressed ' + EDEN.keybindLegend[e.which] + '/' + e.which + '/' + l);
    var keycode = e.which;

    if(EDEN.state.focus != 'shell'){
        FBR.reqYouser.child('keyPress').set(e.which);
        var c = EDEN.numCoord[keycode];

        if(e.which === 107){
//            EDEN.resource = EDEN.resource + (EDEN.comboCount*EDEN.comboCount);
//            EDEN.comboCount = 0;
//            console.log(EDEN.resource);
        }

        if(c){
            EDEN.gridSelect[keycode] = c;

            $(".x"+c[0]+"y"+c[1]).css("background","yellow");
//            var l = EDEN.grid[c[0]][c[1]];
//            if(EDEN.combo === '='){
//                EDEN.combo = l;
//                console.log('LETTER SET.');
//            } else if (EDEN.combo === l){
//                EDEN.comboCount++;
//                console.log('COMBO '+ EDEN.comboCount +'!');
//            } else if (EDEN.combo != l){
//                console.log('COMBO BROKEN.');
//                EDEN.combo = '=';
//                EDEN.comboCount = 0;
//            }
        }

    //    EDEN.$SCOPE.$apply(function(){
    //        EDEN.$SCOPE.combo = EDEN.combo;
    //        EDEN.$SCOPE.comboCount = EDEN.comboCount;
    //        EDEN.$SCOPE.comboScore = EDEN.comboCount*EDEN.comboCount;
    //        EDEN.$SCOPE.resource = EDEN.resource;
    //    });
    }

});
$(window).on('keyup', function(e){
    delete EDEN.Keys[EDEN.keybindLegend[e.which]];
});

// this needs to be in a while loop
//if(EDEN.Keys['w'] === true){
//    console.log('you pressed w');
//}

//FB_REF.child('public').child('worldState').child('grid').on('value',function(data){
//   console.log(data.val());
//
//});



//var meClient = angular.module('meClient', []);