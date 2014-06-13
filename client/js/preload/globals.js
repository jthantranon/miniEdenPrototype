/**
 * Created by John on 6/13/2014.
 */
var EDEN = {
    zIndex: {},
    state: {},
    cache: {}
};

var FB_REF = new Firebase('https://minieden.firebaseio.com');
var FB_AUTH = new FirebaseSimpleLogin(FB_REF, function(error, user) {
//  ...
});

//var meClient = angular.module('meClient', []);