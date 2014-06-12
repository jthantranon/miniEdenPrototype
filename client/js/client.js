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


/////////////////////////////
EDEN.GLASSCOMPS = {
/////////////////////////////
    createGlass: function(id,primaryClass,title,extrasObjLit){
        var $glass = {};
        var extra = extrasObjLit || false;
        var width = extra.width || 410;
        var zIndex = extra.z||EDEN.zIndex.uiBack || 0;

        $glass.ctx = $('#glassPrimer').clone().css('top',100).css('left',100).css('z-index',zIndex)
            .attr('id',id).addClass(primaryClass);
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

/////////////////////////////
EDEN.AUGSHELL = {
/////////////////////////////
    $glass: null,
    $conOut: null,
    init: function(){
        var self = this;
        var egc = EDEN.GLASSCOMPS;
        var width = 510;
        var height = 510;
        this.$glass = EDEN.GLASSCOMPS.createGlass("augShell", "augShell","> Augmented Eden Shell");
        var $ctx = this.$glass.ctx;
        this.$glass.inner.css('width',width);
        this.$glass.content.css('width',width).css('height',height);
        var $conResponse = EDEN.GLASSCOMPS.divClass(this.$glass.content,"consoleResponse");
        var $conWrap = egc.divClass($conResponse,"consoleWrapper");
        this.$conOut = egc.divClass($conWrap,"consoleOutput");
        var $conIn = egc.divClass($conWrap,"consoleInput");
        var $conInDisplay = $('<span class="consoleInputDisplay">></span><div id="caret"></div>').appendTo($conIn); // egc.divClass($conWrap,"consoleInputDisplay");
        $('body').append('> <input name="consoleInputField" id="augShellCommandLine" type="text" maxlength="55"></input>');
        $ctx.on('click',function(){
            $('body').on('keyup',EDEN.AUGSHELL.focus);
        });
        $ctx.on('blur',function(){
            $('#augShellCommandLine').blur();
        });
        $('#augShellCommandLine').on('keyup',function(e){
            var val = $(this).val();
            $('.consoleInputDisplay').html('> '+val);
            if(e.which == 13) { // if they hit enter
                self.print(val);
                EDEN.api(val);
                $(this).val(''); // clear textbox
                $('.consoleInputDisplay').html('>');
            }
        });
        setInterval(function(){ $('#caret').each( function(){ $(this).css('visibility' , $(this).css('visibility') === 'hidden' ? '' : 'hidden') } ); }, 550);
        this.print("&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|_|_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br/>&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|_|_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|_|_|&nbsp;&nbsp;&nbsp;&nbsp;<br/>&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;<br/>&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;<br/>&nbsp;&nbsp;&nbsp;_|_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|_|_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp; STUDIOS",'#cccccc');
        this.print("AugmentedEdenShell - Limited Edition Designer Software",'lime');
        this.print("Version 0.18 Beta",'lime');
//        this.print("<img src='app/img/factions/uniconLogoLarge.png'>");
//        this.print("<img src='app/img/factions/avalonLogoLarge.png'>");
    },
    show: function(){this.$glass.ctx.show();},
    hide: function(){this.$glass.ctx.hide();},
    toggle: function(){
        var self = this;
        if(this.$glass.toggleState){
            this.$glass.ctx.hide();
            $('#augShellCommandLine').blur();
            this.$glass.toggleState = false;
        } else {
            this.$glass.ctx.show();
            $('body').on('keyup',EDEN.AUGSHELL.focus);

            this.$glass.toggleState = true;
        }

    },
    focus: function(){
        $('#augShellCommandLine').focus();
        $('body').off('keyup',EDEN.AUGSHELL.focus);
    },
    print: function(msg,color){
        var msg = color == null ? ('<p>> ' + msg + '</p>') : ('<p>><span style="color:' + color + '"> ' + msg + '</span></p>');
        this.$conOut.append(msg).animate({ scrollTop: this.$conOut.prop("scrollHeight") - this.$conOut.height() }, 100);
    }
};

EDEN.AUGSHELL.init();
/////////////////////////////