//EDEN.$SCOPE = EDEN.$SCOPE || angular.element($("body")).scope();

///
/// MAIN INITIALIZATION
//////////////////////////

$EDEN.shellInputActual.focus();
$EDEN.curtain.on('click',function(){
    if(!EDEN.WIDGETS.LoginUI.visibility){
        $EDEN.shellInputActual.focus();
    }

});

//$EDEN.loginUI.content.html('<label>TEST</label>');

///
/// TEST BED
//////////////////////////



FBR.pWorldState = FBR.public.child('worldState');
FBR.binaryGrid = FBR.pWorldState.child('grid');



EDEN.WIDGETS.LoginUI = (function(){
//    EDEN.$SCOPE.guiStuff = "loginGUI";
//    EDEN.$SCOPE.$apply(function(){
//        EDEN.$SCOPE.guiStuff = "loginGUI";
//    });

    var m = EDEN.Glass.create('eden-gui',{
        name: 'miniEden Login GUI'
    }, ['loginUINotification','loginGUI']);


//    EDEN.$SCOPE.$apply();

    var $email = $("#email");
    var $pass = $("#password");

    /// Init
//    m.dom.content.after('<div id="loginUINotification">PRESS ENTER TO SUBMIT!</div>');
    m.notification = $("#login-ui-notification");

    m.hide();

    m.append = function(c){
        m.dom.notification.html(c);
    };
    m.wrongPassword = function(){
        $pass.val('');
    };
    m.invalidEmail = function(){
        $email.val('');
    };
    m.newAccountPrompt = function(){
//        m.append('EMAIL NOT FOUND, <a href="#" ng-click="register()">CREATE AN ACCOUNT?</a></span');
    };

    return m;
}());

EDEN.WIDGETS.Prompt = (function(){
    var m = EDEN.Glass.create('first-prompt',{
        name: 'HELLO USER...'
    }, ['prompt']);

    m.hide();


//    if(EDEN.STATE.loggedIn){
//        m.hide();
//        console.log('true');
//    }

    return m;
}());

EDEN.WIDGETS.Binary = (function(){
    var m = EDEN.Glass.create('binary',{
        name: 'MINE IT',
        left: 100,
        top: 200,
        height: 175,
        width: 200
    }, ['binary']);

    m.hide();

    return m;
}());

EDEN.WIDGETS.Stats = (function(){
    var m = EDEN.Glass.create('stats',{
        name: 'META-DATA',
        left: 350,
        top: 200,
        height: 175,
        width: 200
    }, ['binaryScore']);

    m.hide();

    return m;
}());

FBR.auth = new FirebaseSimpleLogin(FBR.base, function(error, user) {
    if(error){
        if(error.code === "INVALID_USER"){
            EDEN.MainShell.print(
            'email: -' + EDEN.CACHE.email + '- does not exist.',
            'red',false);
            EDEN.WIDGETS.LoginUI.newAccountPrompt();
            EDEN.$SCOPE.registerClick = true;
            EDEN.$SCOPE.loginMessage = "Email not registered. Register with this email?";
        } else if (error.code === "INVALID_PASSWORD"){
            EDEN.MainShell.print(
            'INCORRECT PASSWORD, PLEASE TRY AGAIN!',
            'red',false);
            EDEN.WIDGETS.LoginUI.wrongPassword();
            EDEN.$SCOPE.loginMessage = "WRONG PASSWORD! Try Again?";
        } else if (error.code ==="INVALID_EMAIL"){
            EDEN.MainShell.print(
            'INVALID EMAIL OR EMAIL FORMAT, PLEASE TRY AGAIN!',
            'red',false);
            EDEN.WIDGETS.LoginUI.invalidEmail();
            EDEN.$SCOPE.loginMessage = "THAT'S NOT AN EMAIL ADDRESS! Try Again?";
        } else {
            EDEN.MainShell.print(error,'red',false);
            EDEN.$SCOPE.loginMessage = error.code;
            console.log(error);
        }
        EDEN.$SCOPE.$apply();

    } else if (user !== null) {
        /// STATE & UI INITIALIZATION & MODIFICATION
        EDEN.CACHE.email = '';
        EDEN.CACHE.pw = '';
        EDEN.WIDGETS.LoginUI.hide();
        EDEN.WIDGETS.Prompt.hide();
        EDEN.WIDGETS.Binary.show();
        EDEN.WIDGETS.Stats.show();
        EDEN.MainShell.print(EDEN.LANG.EN.loggedIn,'green',false);
        EDEN.STATE.loggedIn = true;

        /// BIND Firebase Stuff
        FBR.privateYouser = FBR.privateUsers.child(user.uid);
        FBR.youserRequests = FBR.requests.child(user.uid);
        FBR.youserGridSelects = FBR.youserRequests.child('gridSelects');

        /// SESSION MANAGEMENT
        FBR.thisSesh = FBR.sessions.push(user.uid);
        FBR.thisSesh.onDisconnect().remove();

        /// BINDINGS
        FBR.privateYouser.on('value',function(data){
            var dat = data.val();

            /// TODO: Fix this hack.
            var cacheDat = function(){
                if(typeof EDEN.$SCOPE === 'undefined'){
                    setTimeout(cacheDat,1000);
                } else {
                    EDEN.$SCOPE.privateYouser = dat;
                }
            }();
            /// TODO: End "Fix This Hack"

//            console.log(dat);
        });
        FBR.youserGridSelects.on('value',function(data){
            var dat = data.val();
            EDEN.binarySelects = dat;


            /// TODO: Fix this hack.
            var cacheDat = function(){
                if(typeof EDEN.$SCOPE === 'undefined'){
                    setTimeout(cacheDat,1000);
                } else {
                    EDEN.$SCOPE.colorSelects();
                }
            }();
            /// TODO: End "Fix This Hack"
        });


    } else if (user === null && error === null){
        EDEN.MainShell.print(EDEN.LANG.EN.loggedOut,'green',false);
        EDEN.WIDGETS.Prompt.show();
        EDEN.WIDGETS.Stats.hide();
        EDEN.WIDGETS.Binary.hide();
        EDEN.STATE.loggedIn = false;

        if(FBR.thisSesh){
            FBR.thisSesh.remove();
        }

    }
});

EDEN.Login = function(){
    var e = EDEN.CACHE.email,
        p = EDEN.CACHE.pass;

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




///
/// ANGULAR STUFF
//////////////////////////
var meClient = angular.module('meClient', []);
meClient.controller('MainCtrl', function ($scope) {

    $scope.test = 'best';
    $scope.ftest = function(){
        alert('this');
    };
    $scope.loginMessage = 'PRESS ENTER TO SUBMIT!';
    $scope.loginUIToggle = 'HERE';
    $scope.toggleLoginUI = function(){
        EDEN.$SCOPE.guiStuff = "loginGUI";
//        EDEN.$SCOPE.$apply();
//        EDEN.WIDGETS.LoginUI();

        EDEN.WIDGETS.LoginUI.show();

//        $compile(body.html());



//        EDEN.$SCOPE.directive('autotranslate', function($interpolate, $compile) {
//            return function(scope, element, attr) {
//                var html = element.html();
//                debugger;
//                html = html.replace(/\[\[(\w+)\]\]/g, function(_, text) {
//                    return '<span translate="' + text + '"></span>';
//                });
//                element.html(html);
//                $compile(element.contents())(scope); //<---- recompilation
//            }
//        });
        $("#email").focus();
    };
    $scope.login = function(e,p){
        EDEN.CACHE.email = e || $scope.email;
        EDEN.CACHE.pass = p || $scope.password;
        EDEN.Login();

    };
    $scope.register = function(){
        var pass = EDEN.CACHE.pass || null;
        if(pass === null ){
            console.log('boo');
            $scope.loginMessage = "PLEASE SET A PASSWORD";
            $scope.registerClick = false;
        } else {
            console.log('yay');
            EDEN.Register();
        }
    };
    $scope.bind = function(){
//        $EDEN.primerGlass = $EDEN.primerGlass || $("#glassPrimer");
//        console.log("LOADED!");
    };

    $scope.clicker = function(){
        $('#first-prompt').hide();
        EDEN.WIDGETS.LoginUI.show();
        $('#email').focus();
    };

    $scope.typist = function(){
        $('#first-prompt').hide();
        EDEN.MainShell.print('Welcome typist, try "help" for help!');
        EDEN.MainShell.focus();
    };

    $scope.colorSelects = function(){

        for(coords in EDEN.binarySelects){
            var $coords = $('.'+coords);
//            var binSelect = EDEN.binarySelects[coords];
            if(EDEN.binarySelects.hasOwnProperty(coords) && EDEN.binarySelects[coords] !== false){
                $coords.css('background','yellow');
            } else {
                $coords.css('background','');
            }
        }
    };

    $scope.saveSelects = function(){
        FBR.youserGridSelects.set(EDEN.binarySelects);
    };

    $scope.binaryClick = function(coords,x,y){
//        var $coords = $('.'+coords);
//        EDEN.binarySelect = EDEN.binarySelects || {};
        var thisBinarySelects = EDEN.binarySelects ? EDEN.binarySelects[coords] : false;
//        if(thisBinarySelects !== false){
//            EDEN.binarySelects[coords] = false;
//        } else {
//            EDEN.binarySelects[coords] =
//        }

        if (thisBinarySelects !== false){
            EDEN.binarySelect[coords] = false;
        } else {
            EDEN.binarySelect[coords] = [x,y];
        }

//        EDEN.binarySelects[coords] = thisBinarySelects ? false : [x,y];
        $scope.colorSelects();
        $scope.saveSelects();
//        if(EDEN.binarySelects[coords] === true){
//            $coords.css('background','yellow');
//        } else {
//            $coords.css('background','');
//        }

        console.log(EDEN.binarySelects);
    };

    FBR.binaryGrid.on('value',function(data){
        var dat = data.val();
        $scope.binaryGrid = dat;
        $scope.$apply();
        $scope.colorSelects();
    });




});

//meClient.directive('glass',function(){
//    return {
//        restrict: 'A',
//        scope: {
//            glass: '@'
//        },
//        templateUrl: 'tpl/glass.html',
//        link: function(scope,element){
////            var name = "wee";
////            scope.show = true;
////            var $glass = $(element);
////            $glass.title = $glass.find('.title-wrapper');
////            $glass.title.html('<p>' + name + '</p>');
////            $glass.draggable({handle: ".title-wrapper"});
//            var args = {
//                anchor: element,
//                name: 'wee wee'
//            };
//            EDEN.glass.create('weee',args);
//        }
//    }
//});
//
//meClient.directive('loginGui',function($compile){
//    return {
//        restrict: 'A',
//        scope: {
//            loginGui: '@'
//        },
////        template: '<span ng-click="ftest()">{{test}}</span>',
//        templateUrl: 'tpl/login-gui.html',
//        link: function(scope){
////            alert(scope.meGlass);
//        }
////        ,
////        link: function(scope,element,attrs){
////            element.html('YES');
////            loginGUI = $EDEN.loginGUI.clone().attr('id','login-gui');
//////            loginGUI.attr('ng-click','ftest()');
////            loginGUI.appendTo(element).show();
////            $compile(element);
////        }
//    }
//});


angular.element(document).ready(function() {

    angular.bootstrap(document, ['meClient']);
});
