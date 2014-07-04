/**
 * Created by John on 7/2/2014.
 */
EDEN.ShellParser = (function(){
    m = {};

    m.parse = function(raw){
        ///
        /// Package command into array of arguments
        ////////////////////////////////////////////
        var cmd = (function(raw){
            var myRegexp = /[^\s"]+|"([^"]*)"/gi;
            var matchArray = [];

            do {
                var match = myRegexp.exec(raw);
                if (match != null)
                {
                    matchArray.push(match[1] ? match[1] : match[0]);
                }
            } while (match != null);
            return matchArray;
        }(raw));

        if(EDEN.STATE.promptEmail === true){
            EDEN.CACHE.email = cmd[0];
            EDEN.STATE.promptEmail = false;
            EDEN.STATE.promptPassword = true;
            EDEN.MainShell.print(EDEN.LANG[LANG].shellPassword,'cyan');
        } else if (EDEN.STATE.promptPassword === true){
            EDEN.CACHE.pass = cmd[0];
            EDEN.STATE.promptPassword = false;
            EDEN.STATE.ClearPrompt = true;
            EDEN.STATE.ClearRegistering = true;
            EDEN.MainShell.print(EDEN.LANG[LANG].loggingIn,'cyan');

            if(EDEN.STATE.registering === true){
                EDEN.Register();
            } else {
                EDEN.Login();
            }
//            EDEN.MainShell.print(EDEN.LANG[LANG].shellPassword,'cyan',true);
        }

        if(cmd[0] in EDEN.ShellAPI && !(EDEN.STATE.prompt === true)){
            EDEN.ShellAPI[cmd[0]]();
        } else {
            if(EDEN.STATE.prompt !== true){
                EDEN.MainShell.print(EDEN.LANG[LANG].commandNotRecognized,'red', false);
            }
            if(EDEN.STATE.ClearPrompt === true){
                EDEN.STATE.prompt = false;
                EDEN.STATE.ClearPrompt = false;
            }
        }
    };

    return m;
}());

EDEN.ShellAPI = {
    help: function(){
        EDEN.MainShell.print(EDEN.LANG[LANG].shellHelp,'cyan', false);
    },
    echo: function(){
        EDEN.MainShell.print(cmd,'cyan', false);
    },
    register: function(){
        EDEN.STATE.registering = true;
        EDEN.ShellAPI.login();
    },
    login: function(){
        if(EDEN.STATE.loggedIn){
            EDEN.MainShell.print(EDEN.LANG[LANG].alreadyLoggedIn,'red', false);
        } else {
            EDEN.MainShell.print(EDEN.LANG[LANG].shellEmail,'cyan', false);
            EDEN.STATE.promptEmail = true;
            EDEN.STATE.prompt = true;
        }

    },
    logout: function(){
        // TODO: Catch if already logged out
        if(EDEN.STATE.loggedIn){
            EDEN.MainShell.print(EDEN.LANG[LANG].loggingOut,'orange', false);
            EDEN.Logout();
        } else {
            EDEN.MainShell.print(EDEN.LANG[LANG].alreadyLoggedOut,'red', false);
        }

    }
};