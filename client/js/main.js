

///
/// MAIN INITIALIZATION
//////////////////////////

$EDEN.shellInputActual.focus();

//$EDEN.loginUI.content.html('<label>TEST</label>');

///
/// TEST BED
//////////////////////////

EDEN.WIDGETS.LoginUI = (function(){
    var m = {};
    var $email = $("#email");
    var $pass = $("#password");
    var args = {
        name: 'miniEden Login GUI'
    };
    m.dom = EDEN.Glass.create('eden-gui',args);

    m.hide = function(){
        m.dom.all.hide();
    };
    m.hide();

    m.show = function(){
        m.dom.all.show();
    };


    /// Init
//    m.dom.content.after('<div id="loginUINotification">PRESS ENTER TO SUBMIT!</div>');
    m.dom.notification = $("#login-ui-notification");


    m.append = function(c){
        m.dom.notification.html(c);
    };
    m.wrongPassword = function(){
//        m.dom.content.html('INCORRECT PASSWORD. TRY AGAIN?');
        $pass.val('');
//        m.append('INVALID PASSWORD!');
    };
    m.invalidEmail = function(){
//        m.dom.content.html('INCORRECT PASSWORD. TRY AGAIN?');
        $email.val('');
//        m.append('INVALID EMAIL!');
    };

    m.newAccountPrompt = function(){
//        m.append('EMAIL NOT FOUND, <a href="#" ng-click="register()">CREATE AN ACCOUNT?</a></span');
    };

    return m;
}());

//EDEN.WIDGETS.OldOrNew = (function(){
//    var m = {};
//    var $email = $("#email");
//    var $pass = $("#password");
//    m.dom = EDEN.Glass.create('Old School?');
//
//    m.hide = function(){
//        m.dom.all.hide();
//    };
//    m.hide();
//
//    m.show = function(){
//        m.dom.all.show();
//    };
//
//
//    /// Init
//    m.dom.content.after('<div id="loginUINotification">PRESS ENTER TO SUBMIT!</div>');
//    m.dom.notification = $("#loginUINotification");
//
//
//    m.append = function(c){
//        m.dom.notification.html(c);
//    };
//    m.wrongPassword = function(){
////        m.dom.content.html('INCORRECT PASSWORD. TRY AGAIN?');
//        $pass.val('');
//        m.append('INVALID PASSWORD!');
//    };
//    m.invalidEmail = function(){
////        m.dom.content.html('INCORRECT PASSWORD. TRY AGAIN?');
//        $email.val('');
//        m.append('INVALID EMAIL!');
//    };
//
//    m.newAccountPrompt = function(){
//        m.append('EMAIL NOT FOUND, CREATE AN ACCOUNT?');
//    };
//
//    return m;
//}());


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
//        console.log(user);
        EDEN.CACHE.email = '';
        EDEN.CACHE.pw = '';
        EDEN.WIDGETS.LoginUI.hide();
//        if($EDEN.loginUI){$EDEN.loginUI.hide();}
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
    $scope.loginMessage = 'PRESS ENTER TO SUBMIT!';
    $scope.loginUIToggle = 'HERE';
    $scope.toggleLoginUI = function(){
        EDEN.WIDGETS.LoginUI.show();
        $("#email").focus();
    };
    $scope.login = function(){
        EDEN.CACHE.email = $scope.email;
        EDEN.CACHE.pass = $scope.password;
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

});

angular.element(document).ready(function() {

    angular.bootstrap(document, ['meClient']);
});
