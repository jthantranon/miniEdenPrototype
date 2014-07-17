/**
 * Created by John on 7/3/2014.
 */

EDEN.Glass = (function(){
    var m = {};
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


        $glass.all = $("#glass-primer").clone().css('top', top).css('left', left).attr('id',id);
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
            $glass.visibility = true;
        };

        $glass.hide = function(){
            $glass.all.hide();
            $glass.visibility = false;
        };


        var addComp = function(name,hypthenName){
            $glass[name] = $('#'+hypthenName+'-primer').clone().css('top', top).css('left', left).attr('id',hypthenName);
            switch(compsCamel){
                case 'loginUINotification':
                    $glass.content.after($glass[name]);
                    break;
                case 'loginGUI':
                    $glass[name].find('.email').attr('id','email');
                    $glass[name].find('.password').attr('id','password'); // INTENTIONAL FALL THROUGH no break;
                default:
                    $glass[name].appendTo($glass.content);
                    break;
            }
            $glass[name].show();

        };

        for (var i = 0; i < comps.length; i++){
            var compsCamel = comps[i],
                compsHyphen = compsCamel.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            addComp(compsCamel,compsHyphen);
        }

        return $glass;
    };

    m.test = 'test';

    return m;

}());