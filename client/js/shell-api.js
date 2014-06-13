/**
 * Created by John on 6/12/2014.
 */
EDEN.api = function(raw){
    var preSplit = raw.split(' ');
    var cmd;
    if(preSplit[0] == '!!'){
        cmd = raw.substring(3).split(' !! ');
    } else {
        var myRegexp = /[^\s"]+|"([^"]*)"/gi;
        var matchArray = [];

        do {
            var match = myRegexp.exec(raw);
            if (match != null)
            {
                matchArray.push(match[1] ? match[1] : match[0]);
            }
        } while (match != null);
        cmd = matchArray;
    }
    var params = {};
    if(EDEN.state.settingEmail){
        EDEN.cache.email = cmd[0];
        EDEN.AUGSHELL.print(DIA.login.password,'yellow');
        EDEN.state.settingEmail = false;
        EDEN.state.settingPassword = true;
    } else if (EDEN.state.settingPassword){
//        EDEN.cache.password = cmd[0];
        EDEN.state.settingPassword = false;
        if(EDEN.state.logginIn){
            FB_AUTH.login('password', {
                email: EDEN.cache.email,
                password: cmd[0],
                rememberMe: true
            });
        }else{
            FB_AUTH.createUser(EDEN.cache.email, cmd[0], function(error, user) {
                console.log(error);
                if (!error) {
                    console.log('User Id: ' + user.uid + ', Email: ' + user.email);
                    FB_AUTH.login('password', {
                        email: user.email,
                        password: cmd[0],
                        rememberMe: true
                    });
                }
            });
        }
    }

    switch(cmd[0]){
        case "help":
            EDEN.AUGSHELL.print('There is no help.','red');
            break;
        case "notes":
        case "'notes'":
            EDEN.AUGSHELL.print(DIA.notes.loginUI,'white');
            break;
        case "register":
            EDEN.AUGSHELL.print(DIA.login.email,'yellow');
            EDEN.state.settingEmail = true;
            break;
        case "npm":
            if(cmd[1] === "install"){
                EDEN.AUGSHELL.print("installing program",'yellow');
                if(cmd[2] === "connectionUI"){
                    EDEN.AUGSHELL.print("connectionUI",'yellow');
                }
                EDEN.AUGSHELL.print("please stand by",'yellow');
                $("#connectionUI").show();
                EDEN.AUGSHELL.print("installation complete",'green');
            }
            break;
        case "login":
            EDEN.AUGSHELL.print(DIA.login.email,'yellow');
            EDEN.state.settingEmail = true;
            EDEN.state.logginIn = true;
            break;
    }
};
