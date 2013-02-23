(function () {

    var repl = require('repl');

    var rep = repl.start({
        prompt:    null, //'> ',
        source:    null, //process.stdin,
        eval:      null, //require('vm').runInThisContext,
        useGlobal: true, //false
        useColors: false
    });


    var net = require('net');
    var ac_port = process.env.SUBLIMEREPL_AC_PORT;
    var client = new net.Socket();
    client.connect(ac_port, "localhost", function() {});

    client.on('data', function(data) {
        var strData = data.toString();
        var index = strData.indexOf(":");
        var json = strData.slice(index+1, strData.length - 1)
        var inData = JSON.parse(json);
        var wordIndex = inData.line.slice(inData.cursor_pos).search(/\b/);
        if(wordIndex !== 0){
            inData.line = inData.line.slice(0, inData.cursor_pos);
        }

        var send = function (_, completions) {
            var comps = completions[0];
            var msg = JSON.stringify([inData.line, comps]);
            var payload = msg.length + ":" + msg + ",";
            client.write(payload)
        }
        rep.rli.completer(inData.line, send);
    });

})();
