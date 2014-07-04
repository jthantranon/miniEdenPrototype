/**
 * Created by John on 7/2/2014.
 */

EDEN.MainShell = (function(){
    var m = {};

    /// Public Functions
    m.processInput = function(input){
        $EDEN.shellInputActual.val('');
        m.print(input);
        EDEN.ShellParser.parse(input);
        var prompt;
        if(EDEN.STATE.prompt === true){
            prompt = ''
        } else {
            prompt = '>&nbsp;'
        }
        $EDEN.shellInputDisplay.html(prompt);
    };

    m.print = function(msg,color,Caret){
        color = color || null;
        msg = color == null ? ('<p class="shellOutput">' + EDEN.STATE.Caret(Caret) + msg + '</p>') : ('<p class="shellOutput">' + EDEN.STATE.Caret(Caret) + '<span style="color:' + color + '"> ' + msg + '</span></p>');
        $EDEN.shellInputDisplay.before(msg);
    };

    /// Caret Blink
    setInterval(function(){
        $EDEN.shellCaret.each( function(){ $(this).css('visibility' , $(this).css('visibility') === 'hidden' ? '' : 'hidden') } );
    }, 550);

    /// Banner Display
    m.print("&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|_|_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br/>&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|_|_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|_|_|&nbsp;&nbsp;&nbsp;&nbsp;<br/>&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;<br/>&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;<br/>&nbsp;&nbsp;&nbsp;_|_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|_|_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;_|&nbsp; STUDIOS",'cyan',false);
    m.print("&nbsp;AugmentedEdenShell - Limited Edition Designer Software",'lime',false);
    m.print("&nbsp;Version 0.18 Beta",'lime',false);
    m.print("&nbsp;LOGIN INTERFACE AVAILABLE FOR MOBILE AND THOSE ADVERSE TO THE COMMAND LINE. CLICK HERE.",'red',false);
    m.print("&nbsp;",'red',false);



    /// Display & Actual Input Bindings
    $EDEN.shellInputActual.on('keyup' || 'keydown',function(e){
        var val = $(this).val();
        $EDEN.shellInputDisplay.html(EDEN.STATE.Caret()+val); // Animate Display
        if(e.which == 13) { // if they hit enter
            m.processInput(val);
        }
    });

    return m;


}());