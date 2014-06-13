/////////////////////////////
EDEN.GLASSCOMPS = {
/////////////////////////////
    createGlass: function(id,primaryClass,title,extrasObjLit){
        var $glass = {};
        var extra = extrasObjLit || false;
        var width = extra.width || 410;
        var zIndex = extra.z||EDEN.zIndex.uiBack || 20;

        $glass.ctx = $('#glassPrimer').clone().css('top',100).css('left',100).css('z-index',zIndex)
            .attr('id',id).addClass(primaryClass);
//        $glass.allWrapper = $glass.ctx.find('.allWrapper').css('width',width);
        $glass.content = $glass.ctx.find('.stuffWrapper').css('width',width).css('max-height',600);
        $glass.inner = $glass.ctx.find('.innerAllWrapper').css('width',width)
            .resizable({alsoResize:$glass.content,minWidth: width});
        $glass.title = $glass.ctx.find('.titleWrapper');

        $glass.title.html('<p>' + title + '</p>');

        $glass.ctx.appendTo('body'); // Must append before applying draggable otherwise position: rel is applied (bad)
        $glass.ctx.draggable({handle: ".titleWrapper"});
        $glass.toggleState = false;
        $glass.toggle = function(){
            if($glass.toggleState){
                $glass.ctx.hide();
                $glass.toggleState = false;
            } else {
                $glass.ctx.show();
                $glass.toggleState = true;
            }

        };
        return $glass;
    },
    divClass: function($container,className){
        return $('<div/>').addClass(className).appendTo($container);
//        $container.append("<div></div>").addClass(className);
    },
    stat: function(name,value, size){
        var $stat = $('#statPrimer').clone().attr('id',"StatEntry"+name.replace(/ /g,''));
        var $name = $stat.find('.statName');
        var $value = $stat.find('.statValue');
        $name.html(name);
        $value.html(value);
        size = size || false;
        if(size){
            $stat.removeClass('statEntry').addClass('statEntryWide');
            $stat.css('width',size);
            $name.css('width',size*.6);
            $value.css('width',size*.4);
        }

        return $stat;
    },
    sheetHeader: function(ctx,text){
        EDEN.GLASSCOMPS.divClass(ctx,'sheetHeader').html(text);
    }
};
/////////////////////////////