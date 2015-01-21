var path = require('path'),
	routes = require('./routes'),
	exphbs = require('express3-handlebars'),
	express = require('express');
	morgan = require('morgan'),
	// bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	cookieParser = require('cookie-parser'),
	errorHandler = require('errorhandler'),
	moment = require('moment');

module.exports = function(app) {
	app.engine('handlebars', exphbs.create({
		defaultLayout: 'main',
		layoutsDir: app.get('views') + '/layouts',
		partialsDir: [app.get('views') + '/partials'],
		helpers: {
        	timeago: function(timestamp) {
            	return moment(timestamp).startOf('minute').fromNow();
        	}
    	}
	}).engine);
	app.set('view engine', 'handlebars');

	app.use(morgan('dev'));
	// app.use(bodyParser({
		// uploadDir: path.join(__dirname, '../public/upload/tmp')
	// }));
	app.use(methodOverride());
	app.use(cookieParser('some-secret-value-here'));
	app.use('/public/', express.static(path.join(__dirname, '../public')));

	if ('development' === app.get('env')) {
		app.use(errorHandler());
	}

	routes.initialize(app, new express.Router());

	return app;
};