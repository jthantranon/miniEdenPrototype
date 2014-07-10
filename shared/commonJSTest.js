exports.test = {
    hello: 'a hello',
    goodbye: 'a goodbye',
    FBR: (function(){
        console.log('hahaha');
    }())
};

exports.FBR = function(Firebase){
    var FBR = {};
    FBR.base = new Firebase('https://minieden.firebaseio.com');
    FBR.public = FBR.base.child('public');
    FBR.publicUsers = FBR.public.child('users');
    FBR.publicWorldState = FBR.public.child('worldState');
    FBR.pwsGrid = FBR.publicWorldState.child('grid');
    FBR.private = FBR.base.child('private');
    FBR.privateUsers = FBR.private.child('users');
    FBR.privateSystem = FBR.private.child('system');
    FBR.requests = FBR.base.child('requests');
    FBR.sessions = FBR.base.child('sessions');
    return FBR;
};