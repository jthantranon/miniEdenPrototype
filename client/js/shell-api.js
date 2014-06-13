/**
 * Created by John on 6/12/2014.
 */
EDEN.api = function(raw){
    var print = EDEN.AUGSHELL.print;
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
    switch(cmd[0]){
        case "help":
            EDEN.AUGSHELL.print('There is no help.','red');
            break;
        case "notes":
        case "'notes'":
            EDEN.AUGSHELL.print(DIA[1],'white');
    }
};
