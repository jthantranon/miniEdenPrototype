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

//EDEN.AUGSHELL.init();
/////////////////////////////