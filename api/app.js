var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
testAPIRouter = require("./routes/testAPI");
// Connect DB and auth routes
const connectDB = require('./config/db');
const authRoutes = require('./authenticationRoutes/RegistrationEndpoint');

var app = express();

// Connect to MongoDB
connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/testAPI", testAPIRouter)

// Mount auth routes at /api/auth
app.use('/api/auth', authRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // If request looks like an API call, return JSON 404 instead of rendering an HTML page
  if (req.originalUrl && req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // For API requests return JSON; otherwise render the HTML error page
  if (req.originalUrl && req.originalUrl.startsWith('/api')) {
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  } else {
    res.status(err.status || 500);
    res.render('error');
  }
});

module.exports = app;
