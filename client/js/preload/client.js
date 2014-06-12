var meClient = angular.module('meClient', []);
var EDEN = {
    zIndex: {}
};

meClient.controller('MainCtrl', function ($scope) {
    $scope.uuid = 'test';
    $scope.objects = {};
    $scope.objects.terminal = {
        name: 'glowing terminal',
        type: 'terminal',
        uuid: '1'
    };
    $scope.test = function(){
//        alert('t');
        EDEN.AUGSHELL.toggle();
    }
});

meClient.directive('edenObject',function(){
    return {
//        scope: {
//            edenObject: '=',
//            test: '&test'
//        },
        scope: true,
        restrict: 'A',
        templateUrl: 'tpl/object.html'
    };
});

meClient.directive('edenGlass',function(){
    return {
        scope: true,
        restrict: 'E',
        replace: true,
        templateUrl: 'tpl/glass.html'
    };
});




var gaeCheck = $('#appEngineLoaded').length;
//if(gaeCheck){
//    console.log(true);
//} else {
//    $LAB
//        .script("js/AUGSHELL.js")
//        .script("js/init.js")
//    ;
//}