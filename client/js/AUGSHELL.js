var DIA = [];
DIA[0] = "**Greetings wanderer. If you are reading this, you must have found the terminal. I've left notes here when I passed through in hopes someone else might find them useful. To access them type: 'notes' into the console.**"
DIA[1] = "**Great, you've found my notes...**"

/////////////////////////////
EDEN.AUGSHELL = {
/////////////////////////////
    $glass: null,
    $conOut: null,
    init: function(){
        var self = this;
        var egc = EDEN.GLASSCOMPS;
        var width = 510;
        var height = 310;
        this.$glass = EDEN.GLASSCOMPS.createGlass("augShell", "augShell","> Augmented Eden Shell");
        var $ctx = this.$glass.ctx;
        this.$glass.inner.css('width',width);
        this.$glass.content.css('width',width).css('height',height);
        var $conResponse = EDEN.GLASSCOMPS.divClass(this.$glass.content,"consoleResponse");
        var $conWrap = egc.divClass($conResponse,"consoleWrapper");
        this.$conOut = egc.divClass($conWrap,"consoleOutput");
        var $conIn = egc.divClass($conWrap,"consoleInput");

        $('body').append('> <input name="consoleInputField" id="augShellCommandLine" type="text" maxlength="55"></input>');
        this.$realInput = $('#augShellCommandLine');


        $ctx.on('click',function(){
            $('body').on('keyup',EDEN.AUGSHELL.focus);
        });
        $ctx.on('blur',function(){
            $('#augShellCommandLine').blur();
        });


        this.$conInDisplay = $('<span class="consoleInputDisplay">></span><div id="caret"></div>').appendTo(this.$conOut);


        this.$realInput.on('keyup' || 'keydown',function(e){
            var val = $(this).val();
            $('.consoleInputDisplay').html('> '+val);
            if(e.which == 13) { // if they hit enter
                self.print(val);
                EDEN.api(val); // TODO: Implement commandline api file.
//                $(this).val(''); // clear textbox
//                $('.consoleInputDisplay').html('>');
            }
        });

        setInterval(function(){ $('#caret').each( function(){ $(this).css('visibility' , $(this).css('visibility') === 'hidden' ? '' : 'hidden') } ); }, 550);
        this.print("&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|_|_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br/>&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|_|_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|_|_|&nbsp;&nbsp;&nbsp;&nbsp;<br/>&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;<br/>&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;<br/>&nbsp;&nbsp;&nbsp;_|_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|_|_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp; STUDIOS",'#cccccc');
        this.print("AugmentedEdenShell - Limited Edition Designer Software",'lime');
        this.print("Version 0.18 Beta",'lime');
        this.print(DIA[0],'white');


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
            $('#augShellCommandLine').focus();
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
        var $conIn = $('.consoleInputDisplay');
        var msg = color == null ? ('<p>> ' + msg + '</p>') : ('<p>><span style="color:' + color + '"> ' + msg + '</span></p>');
        $conIn.before(msg);
        this.$realInput.val('');
        $conIn.html('>');
        var currentScroll = this.$conOut.prop("scrollHeight") - this.$conOut.height();
        this.$conOut.scrollTop(currentScroll + 100); //.animate({ scrollBot: this.currentScroll }, 100);
    }
};

//EDEN.AUGSHELL.init();
/////////////////////////////