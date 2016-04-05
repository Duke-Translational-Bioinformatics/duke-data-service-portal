var express = require('express');
var exphbs  = require('express-handlebars');

var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/dist'));

app.set('views', __dirname + '/dist');
app.set('view engine', 'ejs');
app.get('/', function (req, res) {
    res.render('index', {env: process.env});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
