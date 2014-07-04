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
    m.dom = EDEN.Glass.create('MiniEden Login');

    m.hide = function(){
        m.dom.all.hide();
    };
    m.hide();

    m.show = function(){
        m.dom.all.show();
    };


    /// Init
    m.dom.content.after('<div id="loginUINotification">PRESS ENTER TO SUBMIT!</div>');
    m.dom.notification = $("#loginUINotification");


    m.append = function(c){
        m.dom.notification.html(c);
    };
    m.wrongPassword = function(){
//        m.dom.content.html('INCORRECT PASSWORD. TRY AGAIN?');
        $pass.val('');
        m.append('INVALID PASSWORD!');
    };
    m.invalidEmail = function(){
//        m.dom.content.html('INCORRECT PASSWORD. TRY AGAIN?');
        $email.val('');
        m.append('INVALID EMAIL!');
    };

    m.newAccountPrompt = function(){
        m.append('EMAIL NOT FOUND, CREATE AN ACCOUNT?');
    };

    return m;
}());


FBR.auth = new FirebaseSimpleLogin(FBR.base, function(error, user) {
    if(error){
        if(error.code === "INVALID_USER"){
            EDEN.MainShell.print(
            'email: -' + EDEN.CACHE.email + '- does not exist <a href="#">CLICK TO REGISTER WITH THIS EMAIL.</a>',
            'red',false);
            EDEN.WIDGETS.LoginUI.newAccountPrompt();
        } else if (error.code === "INVALID_PASSWORD"){
            EDEN.MainShell.print(
            'INCORRECT PASSWORD, PLEASE TRY AGAIN!',
            'red',false);
            EDEN.WIDGETS.LoginUI.wrongPassword();
        } else if (error.code ==="INVALID_EMAIL"){
            EDEN.MainShell.print(
            'INVALID EMAIL OR EMAIL FORMAT, PLEASE TRY AGAIN!',
            'red',false);
            EDEN.WIDGETS.LoginUI.invalidEmail();
        } else {
            EDEN.MainShell.print(error,'red',false);
            console.log(error);
        }


    } else if (user !== null) {
//        console.log(user);
        EDEN.CACHE.email = '';
        EDEN.CACHE.pw = '';
        if($EDEN.loginUI){$EDEN.loginUI.all.hide();}
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
    $scope.loginUIToggle = 'HERE';
    $scope.toggleLoginUI = function(){
        EDEN.WIDGETS.LoginUI.show();
        $("#email").focus();
    };
    $scope.login = function(){
        console.log('test');
        EDEN.CACHE.email = $scope.email;
        EDEN.CACHE.pass = $scope.password;
        EDEN.Login();

    };
    $scope.register = function(){
        console.log('test');
    }
});
angular.bootstrap(document, ['meClient']);