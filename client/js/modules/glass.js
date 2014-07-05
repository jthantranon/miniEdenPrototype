/**
 * Created by John on 7/3/2014.
 */

EDEN.Glass = (function(){
    var m = {};
//    $EDEN.primerGlass = $EDEN.primerGlass || $("#glassPrimer");
//    $EDEN.primerGlass = $('#glassPrimer');
    m.create = function(id, rawArgs){
        var $glass = {};
        var args = rawArgs || false;
        var width = args.width || 400,
            height = args.height || 60,
            top = args.top || 50,
            left = args.left || 800,
            name = args.name || id,
            maxHeight = args.maxHeight || 600;


        $glass.all = $EDEN.primerGlass.clone().css('top', top).css('left', left).attr('id',id);
        $glass.all
            .appendTo($EDEN.curtain)// Append before applying draggable otherwise position: rel is applied (bad)
            .draggable({handle: ".title-wrapper"})
            .show();

        $glass.title = $glass.all.find('.title-wrapper');
        $glass.content = $glass.all.find('.stuff-wrapper').css('width',width).css('max-height',maxHeight);
        $glass.inner = $glass.all.find('.inner-all-wrapper').css('width',width);

        $glass.title.html('<p>' + name + '</p>');
        $glass.inner.css('width',width);
        $glass.content.css('width',width).css('height',height);
        return $glass;
    };

    m.test = 'test';

    return m;

}());