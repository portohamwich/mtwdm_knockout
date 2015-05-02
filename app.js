var express = require('express');
var compression = require('compression')

var app = express();

app.use(express.static(__dirname + '/'));
app.use(compression);

var server = app.listen(8000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Server listening at http://%s:%s', host, port);

});

var io = require('socket.io').listen(server);

io.on('connection', function(socket){
    console.log('conectado');
    socket.on('COMPRA_REGISTRADA',function(){
        console.log('Entro a Emit.');
        io.sockets.emit('COMPRA_REGISTRADA');
        console.log('COMPRA_REGISTRADA');
    });

    socket.on('COMPRA_REGISTRADA2',function(){
        console.log('Entro a Emit.');
        io.sockets.emit('COMPRA_REGISTRADA');
        console.log('COMPRA_REGISTRADA');
    });
});