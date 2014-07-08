/**
 * Created by John on 7/3/2014.
 */

EDEN.Glass = (function(){
    var m = {};
//    $EDEN.primerGlass = $EDEN.primerGlass || $("#glassPrimer");
//    $EDEN.primerGlass = $('#glassPrimer');
    m.create = function(id, rawArgs, comps){
        var $glass = {};
        var args = rawArgs || false;
        var width = args.width || 400,
            height = args.height || 60,
            top = args.top || 15,
            left = args.left || 15,
            name = args.name || id,
            maxHeight = args.maxHeight || 600;
            anchor = args.anchor || $EDEN.curtain;

        var comps = comps || [];
        var compInit = {};


        $glass.all = $EDEN.primerGlass.clone().css('top', top).css('left', left).attr('id',id);
        $glass.all
            .appendTo(anchor)// Append before applying draggable otherwise position: rel is applied (bad)
            .draggable({handle: ".title-wrapper"})
            .show();

        $glass.title = $glass.all.find('.title-wrapper');
        $glass.content = $glass.all.find('.stuff-wrapper').css('width',width).css('max-height',maxHeight);
        $glass.inner = $glass.all.find('.inner-all-wrapper').css('width',width);

        $glass.title.html('<p>' + name + '</p>');
        $glass.inner.css('width',width);
        $glass.content.css('width',width).css('height',height);

        $glass.show = function(){
            $glass.all.show();
        };

        $glass.hide = function(){
            $glass.all.hide();
        };

        compInit.loginGUI = function(name){
            $glass[name] = $EDEN.loginGUI.clone().css('top', top).css('left', left).attr('id','login-gui');
            $glass[name].appendTo($glass.content).show();
        };

        compInit.loginUINotification = function(name){
            $glass[name] = $EDEN[name].clone().css('top', top).css('left', left).attr('id','login-ui-notification');
            $glass.content.after($glass[name]);
            $glass[name].after($glass.loginGUI).show();
        };

        compInit.prompt = function(name){
            $glass[name] = $EDEN[name].clone().css('top', top).css('left', left).attr('id','prompt');
            $glass.content.after($glass[name]);
            $glass[name].appendTo($glass.content).show();
        };


        compInit.binary = function(name){
            $glass[name] = $EDEN[name].clone().css('top', top).css('left', left).attr('id','binary');
            $glass.content.after($glass[name]);
            $glass[name].appendTo($glass.content).show();
        };

        compInit.binaryScore = function(name){
            $glass[name] = $EDEN[name].clone().css('top', top).css('left', left).attr('id','binary-score');
            $glass.content.after($glass[name]);
            $glass[name].appendTo($glass.content).show();
        };

        for (var i = 0; i < comps.length; i++){
            compInit[comps[i]](comps[i]);
        }

        return $glass;
    };

    m.test = 'test';

    return m;

}());