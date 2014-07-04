/**
 * Created by John on 7/3/2014.
 */

EDEN.Glass = (function(){
    var m = {};
    m.create = function(id){
        var $glass = {};
        $glass.all = $EDEN.primerGlass.css('top',100).css('left',100).attr('id',id);
        $glass.appendTo($EDEN.curtain).show();
    }

}());