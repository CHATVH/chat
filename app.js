var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var routes = require('./routes');

var db = mongoose.connect('mongodb://127.0.0.1:27017/server');
mongoose.Promise = Promise;

var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);
server.listen(4200);

require('./controllers/messages')(io);
require('./controllers/chat_users')(io);




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'ffdbdfbcvbcvbxcbxcvbr5432oo',
    store: new MongoStore({
        url: 'mongodb://127.0.0.1:27017/server',
    }),
	cookie:{
		expires: new Date(Date.now() + 60 * 1000 * 60)
		//maxAge: 1000
	}
}));

app.use(routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
