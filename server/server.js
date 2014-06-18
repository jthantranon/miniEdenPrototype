//var static = require('node-static');
//
//var fileServer = new static.Server('../client');
//
//require('http').createServer(function (request, response) {
//    request.addListener('end', function () {
//        fileServer.serve(request, response);
//    }).resume();
//}).listen(8080);

var WSS_PORT = 8082;
var Firebase = require('firebase');
var pwHash = require('password-hash');
//var FirebaseTokenGenerator = require("firebase-token-generator");
//var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: 8080});
var Chance = require('chance');
var clc = require('cli-color');
var uuid = require('node-uuid');

var cjs = require('../shared/commonJSTest.js');
var FB_KEY = require('../shared/fb-key.js');

var chance = new Chance();
//var tokenGenerator = new FirebaseTokenGenerator('g0SM2eytPDTPm1VjIfhi1s2Iphbvd0sX09bQpLUE');

var baseURL = "https://minieden.firebaseio.com";
var baseRef = new Firebase(baseURL);
var uReqRef = baseRef.child('requests').child('users');
var pubRef = baseRef.child('public');
var priRef = baseRef.child('private');
var reqRef = baseRef.child('requests');

var pubUsersRef = pubRef.child('users');
var priUsersRef = priRef.child('users');
//var reqUsersRef = reqRef.child('users');

var pwsRef = pubRef.child('worldState');
var sessionsRef = baseRef.child('sessions');
var uRef;



function LOG(msg,color){
    fmsg = color ? clc[color](msg) : msg;
    console.log(fmsg);
}

/// Register Server with Firebase
//////////////////////////////////
baseRef.auth(FB_KEY.val, function(error) {
    if(error) {
        console.log("SERVER: Firebase login failed!", error);
    } else {
        LOG("SERVER: Firebase login success!",'green');
    }
});

var SESSIONS = {};
var EDEN = {
    USERS: {}
};


EDEN.grid = [];
EDEN.grid[0] = ['A','B','C'];
EDEN.grid[1] = ['D','E','F'];
EDEN.grid[2] = ['G','H','I'];

console.log(cjs.test);

sessionsRef.on('child_added',function(data){
    var dat = data.val();
    EDEN.SOUL.create(dat);
});

sessionsRef.on('child_removed',function(data){
    var dat = data.val();
    EDEN.SOUL.remove(dat)
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

EDEN.SOULS = {};
EDEN.SOUL = {
    create: function(uid){
        var soul = {};
        soul.loaded = false;
        soul.uid = uid;
        soul.lastKey = null;
//        soul.resource = 0;
        soul.combo = '=';
        soul.comboCount = 0;

        soul.pubRef = pubUsersRef.child(uid);
        soul.priRef = priUsersRef.child(uid);
        soul.reqRef = reqRef.child(uid);

        soul.pubRef.on('value',function(data){
            var dat = data.val();
            soul.loaded = true;
            soul.resource = dat.resource || 0;
        });

        var updateFB = function(){
            soul.pubRef.child('combo').set(soul.combo);
            soul.pubRef.child('comboCount').set(soul.comboCount);
//            if(soul.loaded === true){
//                soul.pubRef.child('resource').set(soul.resource);
//            }
        };

        updateFB();

        soul.priRef.on('value',function(data){
            console.log(data.name());
            console.log(data.val());
        });
        soul.reqRef.on('value',function(data){
            var dat = data.val();
            console.log(data.name());
            console.log(dat);
            if(dat.keyPress === null){
                soul.lastKey = dat.keyPress;
            } else if (dat.keyPress !== soul.keyPress){
                soul.keyPress = dat.keyPress;
                console.log(dat.keyPress);

                var c = EDEN.numCoord[dat.keyPress];
                var l = c ? EDEN.grid[c[0]][c[1]] : 'no grid';
                console.log('you pressed ' + EDEN.keybindLegend[dat.keyPress] + '/' + dat.keyPress + '/' + l);

                if(dat.keyPress === 107){
                    soul.resource = soul.resource + (soul.comboCount*soul.comboCount);
                    soul.comboCount = 0;
                    console.log(soul.resource);
                    soul.pubRef.child('resource').set(soul.resource);
                }

                if(c){

                    if(soul.combo === '='){
                        soul.combo = l;
                        console.log('LETTER SET.');
                    } else if (soul.combo === l){
                        soul.comboCount++;
                        console.log('COMBO '+ soul.comboCount +'!');
                    } else if (soul.combo != l){
                        console.log('COMBO BROKEN.');
                        soul.combo = '=';
                        soul.comboCount = 0;
                    }
                }

                updateFB();

            }
        });

        EDEN.SOULS[uid] = soul;
        console.log(uid+" has logged in.");
    },
    remove: function(uid){
        EDEN.SOULS[uid].priRef.off();
        EDEN.SOULS[uid].reqRef.off();

        delete EDEN.SOULS[uid];
        console.log(uid+" has logged out.");
    }
};




uReqRef.on('value',function(data){
    var dat = data.val();
    console.log(dat);
});

/// HELPER FUNCTIONS
/////////////////////////////////////
function getURef(id){
    return pubUsersRef.child(id);
}

Object.edenObjLen = function(obj){
    var length = 0, key;
    for (key in obj){
        if(obj.hasOwnProperty(key)) length++;
    }
    return length
};
//////////////////////////////////////

EDEN.STATE = (function(state){
    state = {};
    state.mobs = state.mobs || {};
    state.projectiles = state.projectiles || {};
    state.update = function(){
        var t = EDEN_CLOCK.time;
        function stringTime(u){
            var tString = Math.floor(u).toString();
            return (tString.length ==1) ? '0' + tString : tString;
        }
        pwsRef.child('time').set({
            cycle: stringTime(t.cycle),
            deci: stringTime(t.deci),
            centi: stringTime(t.centi),
            milli: stringTime(t.milli),
            micro: stringTime(t.micro),
            nano: stringTime(t.nano)
        });
//        pwsRef.child('time').set(EDEN_CLOCK.time);
//        console.log('updating State');
    };
    return state;
}(EDEN.STATE || {}));

var EDEN_RANDOM_EVENTS = (function(events){
    events = {};
    events.scram = function(force){
        var x = chance.integer({min: 0, max: 2});
        var y = chance.integer({min: 0, max: 2});
        EDEN.grid[x][y] = chance.character({alpha: true, casing: 'upper'});
        pwsRef.child('grid').set(EDEN.grid);
        console.log(EDEN.grid);
    };
    events.weather = function(force){
        var l = {
            1: 'snow',
            2: 'rain',
            3: 'laggy',
            4: 'fluid',
            5: 'hail',
            6: 'bit storm',
            7: 'no weather',
            8: 'no weather',
            9: 'no weather',
            10: 'no weather'
        };

        if(chance.d100() > 90 || force){
            EDEN.WEATHER = l[chance.d10()];
            pwsRef.child('weather').set(EDEN.WEATHER);
            LOG('WEATHER REPORT: ' +EDEN.WEATHER,'cyan');
        }
    };

    events.spawnMob = function(force){
        function mobFactory(type){
            return {
                type: type,
                name: chance.name(),
                hp: chance.d100(),
                uuid: uuid.v4()
            }
        }
//        var beastiary = {
//            bug: {
//
//            }
//        };
        var mobs = {
            1: mobFactory('bug'),
            2: mobFactory('crawler'),
            3: mobFactory('SOPA'),
            4: mobFactory('PRISM'),
            5: mobFactory('pop-up ad'),
            6: mobFactory('spam bot')
        };
        if(force || (chance.d100() > 70 && (!EDEN.STATE.mobs || Object.edenObjLen(EDEN.STATE.mobs) < 5))){
            newMob = mobs[chance.d6()];
            EDEN.STATE.mobs[newMob.uuid] = newMob;
            pwsRef.child('mobs').set(EDEN.STATE.mobs);
            console.log(newMob);
        }
    };

    return events;
}(EDEN_RANDOM_EVENTS || {}));

var EDEN_CLOCK = (function(clock,rEvents){
    clock = {};

    function eventsNano(){

    }

    function eventsMicro(){
//        rEvents.scram();
    }

    function eventsMilli(){
        EDEN.STATE.update();
        rEvents.weather();
        rEvents.spawnMob();
        rEvents.scram();
    }

//    YY:MM:WW:DD:HH:MM:SS:MS

    // 1 ms = nc ms
    // 100 ms = μc second
    // 6,000 = mc minute
    // 1,000,000 =

    // cycle = 86400000000000 // month 100 days
    // cycle = 864000000000 // month 1000 days
    // deci = 8640000000 // week (10 days)
    // centi = 86400000 // day actual
    // milli = 864000 // hour
    // micro = 8640 // minute
    // nano = 86.4 // second


    // deca = 31536000000 // year actual
    // cycle = 315360000 // month
    // deci = 3153600 // week
    // centi = 31536 // day
    // milli = 315.36 // hour
    // micro = 3.1536 // minute
    // nano = .031536 // second

    // cycle = 2678400000 // month actual
    // deci = 26784000 // week
    // centi = 267840 // day
    // milli = 2678.4 // hour
    // micro = 26.784 // minute
    // nano = .26784 // second


    // cycle = 604800000 // week actual
    // deci = 6048000 // day
    // centi = 60480 // hour
    // milli = 604.8 // minute
    // micro = 6.048 // second


    // cycle = 8640000000 // 100 days
    // deci = 86400000 // 1 day actual
    // centi = 864000 // 1 hundreth of an hour (eden minute)
    // milli = 8640 // seconds
    // micro = 86.4 // hour
    // nano = .8646 //

    // deca =31536000000
    // centi = 315360000
    // milli = 3153600
    // micro = 31536
    // nano = 315.36

    /// nano 60/100 seconds
    // micro 60/100 minutes
    // milli 24/100 hours
    // centi 30/100 days
    // deca 365/100 year

    var epoch = 1396249200000;

    clock.tick = function(){
        var now = new Date().getTime() - epoch;
        var time = clock.time;
        var l = 99;
        if(time.nano > l){time.nano = time.nano-l;time.micro++;eventsMicro();}
        if(time.micro > l){time.micro = 0; time.milli++;eventsMilli();}
        if(time.milli > l){time.milli = 0; time.centi++;}
        if(time.centi > l){time.centi = 0; time.deci++;}
        if(time.deci > l){time.deci = 0; time.cycle++;}
        eventsNano();
        time.nano = time.nano + 10;
//        console.log(clock.time);
    };

    clock.start = function(){


        var epoch = 1396249200000;
        var now = new Date().getTime();
        var elapsed =  now - epoch;
        var cycle = 8640000000;
        var edenTime = elapsed/cycle;

        function tForm(unit){
            unit = unit || "00";
            console.log(unit);
//            var formatted =
            return (unit*100) % 100;
//            var thereturn = (formatted < 10) ? ("0" + formatted) : formatted;
//            console.log(thereturn);
//            return thereturn.toString();
        }

        var xc = edenTime % 100;
        var dc = tForm(xc); // days
        var cc = tForm(dc); // hours
        var mc = tForm(mc); // minutes
        var uc = tForm(uc); // seconds
        var nc = tForm(nc); // ms

        clock.time = clock.time || {
            nano: nc,
            micro: uc,
            milli: mc,
            centi: cc,
            deci: dc,
            cycle: xc
        };


        rEvents.weather(true);
        rEvents.spawnMob(true);
        setInterval(clock.tick,8.646);
    };


//    clock.tick = function(){
//        var time = clock.time;
//        var l = 99;
//        if(time.nano > l){time.nano = 0;time.micro++;eventsMicro();}
//        if(time.micro > l){time.micro = 0; time.milli++;console.log(time);}
//        if(time.milli > l){time.milli = 0; time.centi++;}
//        if(time.centi > l){time.centi = 0; time.deci++;}
//        if(time.nano > l){EDEN.CLOCK.NANOCYCLE = 1; EDEN.CLOCK.MICROCYCLE++;} // console.log("MICROCYCLE: " + EDEN.CLOCK.MICROCYCLE);}
//        eventsNano();
//        time.nano++;
////        console.log(clock.time);
//    };

//    clock.start = function(){
//        clock.time = clock.time || {
//            nano: 0,
//            micro: 0,
//            milli: 0,
//            centi: 0,
//            deci: 0
//        };
//        rEvents.weather(true);
//        rEvents.spawnMob(true);
//        setInterval(clock.tick,100);
//    };

    pwsRef.child('time').once('value',function(data){
//        clock.time = data.val() || {};
        clock.start();
    });



    return clock;
}(EDEN_CLOCK|{},EDEN_RANDOM_EVENTS));


console.log('Welcome to MiniEden, Administrator.');

var WSM = (function (wsm) {
    wsm = {};
    var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: WSS_PORT});

    /// INITS
    //////////
    function initWSDependencies(ws){
        /// PACK N SEND FUNCTION EXPOSED PUBLICLY THROUGH WSM.pns
        ///////////////////////////////////////////////////////////
        wsm.pns = function (data,type){
//            console.log(data);
            type = type || 'misc';
            if((typeof data) != 'object'){
                var oldData = data;
                data = {
                    dataType: typeof oldData,
                    data: oldData
                }
            }
            data.type = type;
            ws.send(JSON.stringify(data));
        }; ///////////////////////////////////////////////////////////
    }

    /// WSM HELPERS
    ////////////////
    function bouncer(creds){
        if(EDEN.USERS && EDEN.USERS[creds.sender] && EDEN.USERS[creds.sender].seshKey === creds.seshKey){
            LOG('BOUNCER: '+creds.sender+' is legit.','cyan');
            return true;
        } else {
            LOG('BOUNCER: '+creds.sender+' is NOT LEGIT.','redBright');
        }
    }

    /// EVENTS
    //////////
    wss.on('connection', function(ws) {
        initWSDependencies(ws);

        ws.on('message', function(rawPack) {
            jPack = JSON.parse(rawPack);
//            console.log(jPack.type);

            var packTypes = {
//                login: login,
//                logout: logout,
//                register: register,
                test: test,
                action: EDEN.ACTIONS[jPack.actionType],
                auth: EDEN.AUTH[jPack.authType]
            };

            if(packTypes[jPack.type]){
                jPack.legit = bouncer(jPack.creds);
                packTypes[jPack.type](jPack);
            }else{
                console.log('no pack type')
            }
        });
        wsm.pns('You have connected to the websocket.');
    });

    return wsm;
}(WSM || {}));

EDEN.AUTH = (function(auth,wsm){
    auth = {};
    auth.authReq = function(msg){
        LOG(('AUTH: ' + msg.uid + ' is requesting authorization.'),'cyan');
//        console.log(msg.data);
        var pRef = priUsersRef.child(msg.uid);
        pRef.once('value',function(data){
            var newKey = chance.d100();
            EDEN.USERS[msg.uid] = {
                seshKey: newKey,
                pRef: pRef
            };
//            console.log(EDEN.USERS);
            LOG('AUTH: New key generated for ' + msg.uid + '. Requesting key echo.','cyan');
            pRef.child('seshKey').set(newKey,wsm.pns({
                authType: 'requestKey'
            },'auth'));
        })
    };
    auth.keyReply = function(msg){
//        console.log('auth');
//        console.log(msg);
//        console.log(EDEN.USERS[msg.uid]);
        if(msg.key == EDEN.USERS[msg.uid].seshKey){
            LOG('AUTH: Key sync from'+msg.uid,'green');
            wsm.pns({
                authType: 'authenticated',
                data: 'WELCOME YOU ARE AUTHENTICATED.'
            },'auth');
        } else {
            LOG('AUTH: Key de-sync from '+msg.uid,'redBright');
        }
    };
    return auth
}(EDEN.AUTH || {},WSM));

EDEN.ACTIONS = {
    rollDice: function(dat){
        if(dat.legit){
            var diceResult = chance.d10();
            LOG('ACTION: ' + dat.creds.sender + ' rolled: ' + diceResult,'yellowBright');
            priUsersRef.child(dat.creds.sender).child('actions').child('rollDice').set(diceResult);
        }
    },
    attack: function(dat){
        if(dat.legit){
            var mob = EDEN.STATE.mobs[dat.target];

            if(mob){
                var damage = chance.d10();

                WSM.pns({
                    uiType: 'feedback',
                    msg: 'You hit evil for ' + damage + " damage!"
                },'ui');

                var newHP = mob.hp - damage;

                var atkWord = chance.word();
                EDEN.STATE.projectiles[atkWord] = true;
                setTimeout(function(){
                    delete EDEN.STATE.projectiles[atkWord];
                    WSM.pns({
                        uiType: 'closeNoty',
                        uuid: atkWord
                    },'ui')
                },5000);
                WSM.pns({
                    projectileType: 'atkWord',
                    word: atkWord,
                    target: dat.creds.sender
                },'projectile');

                if(newHP <= 0){
                    delete EDEN.STATE.mobs[dat.target];
//                  EDEN.STATE.update();
                    pwsRef.child('mobs').child(dat.target).remove();
                    EDEN.USERS[dat.creds.sender].pRef.child('bits').once('value',function(data){
                        data = data.val() || 0;
                        var earn = chance.d10();
                        EDEN.USERS[dat.creds.sender].pRef.child('bits').set(data+earn);
                        WSM.pns({
                            uiType: 'feedback',
                            msg: 'You have destroyed evil and earned ' + earn + ' bits!'
                        },'ui');
                    });
                    WSM.pns({
                        uiType: 'closeNoty',
                        uuid: dat.target
                    },'ui');

                } else {
                    EDEN.STATE.mobs[dat.target].hp = newHP;
                    console.log(EDEN.STATE.mobs[dat.target].hp);
                    pwsRef.child('mobs').child(dat.target).set(EDEN.STATE.mobs[dat.target]);
                }
            } else {
                console.log('ERROR: Target not found.');
            }
        }
    },
    deflectAtkWord: function(dat){
        if(dat.legit){
            var word = EDEN.STATE.projectiles[dat.target];
            if(word){
                WSM.pns({
                    uiType: 'closeNoty',
                    uuid: dat.target
                },'ui');
                delete EDEN.STATE.projectiles[dat.target];
                EDEN.USERS[dat.creds.sender].pRef.child('bits').once('value',function(data){ //dupe code
                    data = data.val() || 0;
                    var earn = chance.d100();
                    EDEN.USERS[dat.creds.sender].pRef.child('bits').set(data+earn);
                    WSM.pns({
                        uiType: 'feedback',
                        msg: 'You successfully deflected the word attack and earned ' + earn + " bits!"
                    },'ui');
                });
            }
        }
    },
    search: function(msg){
        var roll = chance.d100();
        console.log(roll);
        var pack = {
            subType: 'roll',
            roll: roll
        };
        if(roll < 60){
            console.log('fail roll');
            pack.msg = 'rolled: '+roll+' (fail)';
            pack.wasSuccessful = false;
        } else {
            console.log('you found a logout-device');
            pack.msg ='rolled: '+roll+'(found something)';
            pack.wasSuccessful = true;
        }
        WSM.pns(pack,'actionFeedback');
        msg.uRef.child('dice').set(chance.rpg('5d10'));
    },
    talk: function(msg){
        console.log('you tried to talk');
    }
};

//function login(msg){
//    console.log('login object recieved ' + msg.name);
//    pubUsersRef.child(msg.name).set(pwHash.generate(msg.name));
//
//}
//
//function logout(msg){
//    console.log(msg);
//}

//function register(msg){
//    uRef = pubUsersRef.child(msg.uuid);
//    console.log('register');
//    console.log(msg);
//
//    uRef.once('value',function(data){
//        var dat = data.val();
//        var uuid;
//        uDat = {
//            email: msg.email,
//            password:pwHash.generate(msg.password),
//            uuid: msg.uuid,
//            name: getName(dat),
//            token: token || "noToken"
//        };
//       if(dat){
//           console.log('already registered');
//           var valid = pwHash.verify(msg.password,dat.password);
////           var tokenObj = {
////               token: token,
////               email: msg.email,
////               uuid: uuid,
////               name: getName(dat)
////           };
//            if(valid){
//                WSM.pns('pass match!');
//                var token = tokenGenerator.createToken(uDat);
//                uDat.token = token;
//                WSM.pns(JSON.stringify(uDat),'token');
//                console.log('password match');
//                SESSIONS[token] = uDat;
////                console.log(SESSIONS[token]);
//           } else {
//               var tokenCookie = msg.password.split(';')[0];
//               if(SESSIONS[tokenCookie]){
//                   uDat.token = tokenCookie;
//                   WSM.pns(JSON.stringify(uDat),'token');
//                   console.log(uDat.name);
//                   console.log(SESSIONS[tokenCookie]);
//               }
//               console.log('wrong password');
//           }
//       } else {
//           pubUsersRef.child(msg.uuid).set(uDat);
//       }
//    });
//
//
//}

function getName(dat){
    var name = 'Mxxx-Exxx-4xxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    if(!dat || !dat.displayName){
        uRef.child('uniqueName').set(name);
    } else {
        name = dat.displayName;
    }
    return name;

}

function test(msg){
    var uid = SESSIONS[msg.data];
    console.log(uid);
    pubUsersRef.child(uid).once('value',function(data){
        var dat = data.val();
        console.log(dat);
    })
}