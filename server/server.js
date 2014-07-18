var WSS_PORT = 8082;
var Firebase = require('firebase');
var pwHash = require('password-hash');

var Chance = require('chance');
var clc = require('cli-color');
var uuid = require('node-uuid');

var cjs = require('../shared/commonJSTest.js');
var FB_KEY = require('../shared/fb-key.js');

var chance = new Chance();

var uRef;

process.on('SIGINT', function(){
    LOG('shutting down','green');
    process.exit();
});

function LOG(msg,color){
    var fmsg = color ? clc[color](msg) : msg;
    console.log(fmsg);
}

var FBR = cjs.FBR(Firebase);

/// Register Server with Firebase
//////////////////////////////////
FBR.base.auth(FB_KEY.val, function(error) {
    if(error) {
        console.log("SERVER: Firebase login failed!", error);
    } else {
        LOG("SERVER: Firebase login success!",'green');
        FBR.pwsGrid.once('value',function(data){
            var dat = data.val();
            EDEN.grid = dat;
            console.log(dat);
        });

    }
});

var SESSIONS = {};
var EDEN = {
    USERS: {},
    SOUL: {},
    SOULS: {}
};

FBR.sessions.on('child_added',function(data){
    var dat = data.val();
    if(!EDEN.SOULS[dat]){
        EDEN.SOUL.create(dat);
    }
});

FBR.sessions.on('child_removed',function(data){
    var dat = data.val();
    console.log('REMOVING: ' + dat);
    EDEN.SOUL.remove(dat);
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
EDEN.SOULS_LIST = {};
EDEN.SOUL = {
    create: function(uid){
        var soul = {};
        soul.loaded = false;
        soul.uid = uid;
        soul.keyPress = null;
        soul.gridSelectionSize = 0;
        soul.gridPoints = 0;
        soul.comboCoords = {};

        soul.pubRef = FBR.publicUsers.child(uid);
        soul.priRef = FBR.privateUsers.child(uid);
        soul.reqRef = FBR.requests.child(uid);

        /// BINDINGS
        soul.pubRef.on('value',function(data){
            var dat = data.val();
        });

        soul.priRef.once('value',function(data){ /// TODO: changed from on to once, can be really bad.
            var dat = data.val() || false;
            soul.loaded = true;

            if(dat !== false){
                soul.bits = dat.bits || 0;
                soul.furnace = dat.furnace || 0;
                soul.furnaceProg = dat.furnaceProg || 0;
                soul.kb = dat.kb || 0;
            }

        });

        soul.updateFB = function(){ // TODO: this is probably really dumb, i should fix this.
            if(soul.loaded === true){
                soul.priRef.child('bits').set(soul.bits);
                soul.priRef.child('kb').set(soul.kb);
                soul.priRef.child('furnace').set(soul.furnace);
                soul.priRef.child('furnaceProg').set(soul.furnaceProg);

                soul.priRef.child('points').set(soul.gridPoints || 0);
                soul.priRef.child('selectionSize').set(soul.gridSelectionSize || 0);
            }
        };

        /// FURNACE LOGIC
        soul.reqRef.child('furnace').on('value',function(data){
            var dat = data.val();
            var bits = dat*1024;
            if(dat > 0 && (soul.bits >= (1024*dat))){
                soul.priRef.child('furnace').set(soul.furnace += dat);
                soul.bits -= (1024*dat);
            }
            soul.reqRef.child('furnace').set(0);
        });

        soul.reqRef.child('gridSelects').on('value',function(data){
            var dat = data.val();
            soul.comboCoords = dat;
        });

        EDEN.SOULS[uid] = soul;
        EDEN.SOULS_LIST[uid] = true;
        FBR.psUsers.set(EDEN.SOULS_LIST || 'empty');
        LOG(uid+" has logged in.",'green');
    },
    remove: function(uid){
        EDEN.SOULS[uid].pubRef.off();
        EDEN.SOULS[uid].priRef.off();
        EDEN.SOULS[uid].reqRef.off();

        delete EDEN.SOULS[uid];
        delete EDEN.SOULS_LIST[uid];
        FBR.psUsers.set(EDEN.SOULS_LIST || 'empty');
        LOG(uid+" has logged out.",'green');
    }
};

/// HELPER FUNCTIONS
/////////////////////////////////////
function getURef(id){
    return FBR.publicUsers.child(id);
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
        FBR.publicWorldState.child('time').set({
            cycle: stringTime(t.cycle),
            deci: stringTime(t.deci), // KiloCycle
            centi: stringTime(t.centi), // MegaCycle
            milli: stringTime(t.milli), // GigaCycle
            micro: stringTime(t.micro), // TeraCycle
            nano: stringTime(t.nano) // PentaCycle
        });
    };
    return state;
}(EDEN.STATE || {}));

function gridScores(thisSoul){
    var letters = {
        '0': 0,
        '1': 0
    };

    var selectionSize = 0;
    for (var key in thisSoul.comboCoords){
        if(thisSoul.comboCoords.hasOwnProperty(key)){
            var c = thisSoul.comboCoords[key];
            if(c !== false){
                var l = (EDEN.grid[c[0]][c[1]]).toString();
                letters[l]++;
                selectionSize++;
            }
        }
    }

    var points = 0;
    if(letters['0'] === 0){
        points =  letters['1'];
    } else if (letters['1'] === 0){
        points = letters['0'];
    }

    thisSoul.gridSelectionSize = selectionSize;
    thisSoul.gridPoints = points;
    thisSoul.bits += points*selectionSize;
    thisSoul.updateFB();
}

function furnaceTick(soul){
    var process = function(){
        soul.furnace -= 1;
//        soul.updateFB();
        soul.kb += 1;
//        soul.updateFB();
    };
    if(soul.furnace > 0){
        if(soul.furnaceProg >= 100){
            soul.furnaceProg = 0;
//            soul.updateFB();
            process();
        } else if (soul.furnaceProg >= 0 && soul.furnaceProg !== 100){
            soul.furnaceProg += 5;
//            soul.updateFB();
        }

    }
}


var EDEN_RANDOM_EVENTS = (function(events){
    events = {};
    events.tallyScores = function(force){
        for (var soul in EDEN.SOULS) {
            if (EDEN.SOULS.hasOwnProperty(soul)) {
                var thisSoul = EDEN.SOULS[soul];

                gridScores(thisSoul);
                furnaceTick(thisSoul);
            }
        }
    };

    events.furnace = function(force){

    };

    events.scram = function(force){
        var x = chance.integer({min: 0, max: 2});
        var y = chance.integer({min: 0, max: 2});
        EDEN.grid[x][y] = chance.natural({min: 0, max: 1});
        FBR.publicWorldState.child('grid').set(EDEN.grid);
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
            FBR.publicWorldState.child('weather').set(EDEN.WEATHER);
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
            FBR.publicWorldState.child('mobs').set(EDEN.STATE.mobs);
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
        rEvents.tallyScores();
    }

    function eventsMilli(){
        EDEN.STATE.update();
        rEvents.scram();
        rEvents.weather();
        rEvents.spawnMob();
    }

    clock.tick = function(){
        var time = clock.time;
        var l = 99;
        if(time.nano > l){time.nano = time.nano-l;time.micro++;eventsMicro();}
        if(time.micro > l){time.micro = 0; time.milli++;eventsMilli();}
        if(time.milli > l){time.milli = 0; time.centi++;}
        if(time.centi > l){time.centi = 0; time.deci++;}
        if(time.deci > l){time.deci = 0; time.cycle++;}
        eventsNano();
        time.nano += 2;
    };

    clock.start = function(){
        var epoch = 1396249200000;
        var now = new Date().getTime();
        var elapsed =  now - epoch;
        var cycle = 8640000000;
        var edenTime = elapsed/cycle;

        function tForm(unit){
            unit = unit || "00";
            return (unit*100) % 100;
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

    FBR.publicWorldState.child('time').once('value',function(data){
        clock.start();
    });

    return clock;
}(EDEN_CLOCK|{},EDEN_RANDOM_EVENTS));


LOG('Welcome to MiniEden, Administrator.','cyan');

var WSM = (function (wsm) {
    wsm = {};
    var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: WSS_PORT});

    /// INITS
    //////////
    function initWSDependencies(ws){
        /// PACK N SEND FUNCTION EXPOSED PUBLICLY THROUGH WSM.pns
        ///////////////////////////////////////////////////////////
        wsm.pns = function (data,type){
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
            var jPack = JSON.parse(rawPack);

            var packTypes = {
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
        var pRef = FBR.privateUsers.child(msg.uid);
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
            FBR.privateUsers.child(dat.creds.sender).child('actions').child('rollDice').set(diceResult);
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
                    FBR.publicWorldState.child('mobs').child(dat.target).remove();
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
                    FBR.publicWorldState.child('mobs').child(dat.target).set(EDEN.STATE.mobs[dat.target]);
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