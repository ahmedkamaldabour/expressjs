var express = require('express');
const postController = require('../app/http/controllers/PostController');
var router = express.Router();

// Define your routes here

// index of all posts
router.get('/', postController.index);
// show a single post
router.get('/:id', postController.show);
// store a new post
router.post('/', postController.store);


module.exports = router;