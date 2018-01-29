const hsts = require('hsts');
const sslRedirect = require('heroku-ssl-redirect');
const express = require('express');
const helmet = require('helmet');
const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(sslRedirect(['development','ua_test','production']), hsts({maxAge: 15552000}), express.static(__dirname + '/dist'), helmet());

app.set('views', __dirname + '/dist');

app.set('view engine', 'ejs');

app.get('/*', (req, res) => {
    res.render('index', {env: process.env});
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
