var meClient = angular.module('meClient', []);

meClient.controller('MainCtrl', function ($scope) {
    $scope.connectionStatus = 'NOT CONNECTED';
    $scope.uuid = 'test';
    $scope.objects = {};
    $scope.objects.terminal = {
        name: 'glowing terminal',
        type: 'terminal',
        uuid: '1'
    };
    $scope.test = function(){
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

angular.bootstrap(document, ['meClient'])