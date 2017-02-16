var hsts = require('hsts');
var sslRedirect = require('heroku-ssl-redirect');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(sslRedirect(['development','ua_test','production']), hsts({maxAge: 15552000}), express.static(__dirname + '/dist'));

app.set('views', __dirname + '/dist');
app.set('view engine', 'ejs');
app.get('/*', function (req, res) {
    res.render('index', {env: process.env});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
