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