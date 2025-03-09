var express = require('express');
var morgan = require('morgan')
var apiResponse = require('../app/helpers/apiResponse');
var router = express.Router();

// morgan middleware to log requests
router.use(morgan('dev'));

// Middleware to parse JSON data from request body to req.body object for POST and PUT requests
router.use(express.json());

router.get('/', function (req, res) {
    return apiResponse(res, 200, 'Welcome to Express API template');
});

// Post model routes
router.use('/posts', require('./post'));


module.exports = router;
