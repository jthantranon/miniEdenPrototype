/**
 * Created by John on 7/3/2014.
 */

EDEN.Glass = (function(){
    var m = {};
    m.create = function(id){
        var $glass = {};
        var width = 400;
        var height = 60;
        $glass.all = $EDEN.primerGlass.css('top',50).css('left',800).attr('id',id);
        $glass.all
            .appendTo($EDEN.curtain)// Append before applying draggable otherwise position: rel is applied (bad)
            .draggable({handle: ".titleWrapper"})
            .show();

        $glass.title = $glass.all.find('.titleWrapper');
        $glass.content = $glass.all.find('.stuffWrapper').css('width',width).css('max-height',600);
        $glass.inner = $glass.all.find('.innerAllWrapper').css('width',width);

        $glass.title.html('<p>' + id + '</p>');
        $glass.inner.css('width',width);
        $glass.content.css('width',width).css('height',height);
        return $glass;
    };

    m.test = 'test';

    return m;

}());