require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api')
const apiResponse = require("./app/Helpers/apiResponse");
const {static} = require("express");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter)

// for apis routes handling 404 for unknown routes
app.all('/api/*',
    (req, res, next) => {
        return apiResponse(res, 404, `Route not found ${req.originalUrl}`);
    });

// catch 404 and forward to error handler
app.use('*', function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.statusCode || 500);

    return apiResponse(res, res.statusCode, err.message || 'Internal Server Error',
        {
            'status': err.statusCode,
            'isOperational': err.isOperational,
            'stack': err.stack

        } || null,
        null);
    // res.render('error');
});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(uri).then(() => {
    console.log('✅ Connected to MongoDB');
}).catch(err => {
    console.error('❌ Error connecting to MongoDB:', err.message);
});

module.exports = app;
