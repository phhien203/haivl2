var express = require('express'),
	config = require('./server/configure'),
	app = express(),
    mongoose = require('mongoose');

app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app = config(app);

//mongoose.connect('mongodb://localhost/imgPloadr');
mongoose.connect('mongodb://nodejitsu:180619b6b49e7a1ba4101b96d263e2da@troup.mongohq.com:10090/nodejitsudb192674293');
mongoose.connection.on('open', function() {
    console.log('Mongoose connected.');
});

var server = app.listen(app.get('port'), function() {
	console.log('Server up: http://localhost/' + app.get('port'));
});