var express = require('express')
var path = require('path')
var fs = require('fs')
var app = express()
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

app.set('port', (process.env.PORT || 5000)); // process.env.PORT is for Heroku instance

app.use(express.static(__dirname + '/'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/data', function(request, response) {
    // TBD
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
