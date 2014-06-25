var meClient = angular.module('meClient', []);

meClient.controller('MainCtrl', function ($scope) {
    $scope.connectionStatus = 'NOT CONNECTED';
    $scope.uuid = 'test';
    $scope.objects = {};
    $scope.combo = '=';
//    var grid = [];
//    grid[0] = ['A','B','C'];
//    grid[1] = ['D','E','F'];
//    grid[2] = ['G','H','I'];
//
//    $scope.grid = grid;
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


//EDEN.$SCOPE = EDEN.$SCOPE || angular.element($("#MainCtrl")).scope();
FBR.base.child('public').child('worldState').child('grid').on('value',function(data){
    EDEN.$SCOPE = EDEN.$SCOPE || angular.element($("#MainCtrl")).scope();
    EDEN.$SCOPE.$apply(function(){
        EDEN.$SCOPE.grid = data.val();
        EDEN.grid = data.val();
    });
    for (var highlight in EDEN.gridSelect) {
        if (EDEN.gridSelect.hasOwnProperty(highlight)) {
            var c = EDEN.gridSelect[highlight];
            $(".x"+c[0]+"y"+c[1]).css("background","yellow");
        }
    }
});




angular.bootstrap(document, ['meClient']);