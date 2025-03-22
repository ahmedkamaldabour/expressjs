var express = require('express');
const postController = require('../app/Http/Controllers/PostController');
const authMiddleware = require('../app/Http/Controllers/Auth/AuthController').protected;
var router = express.Router();

// Define your routes here


// index of all posts
router.get('/', authMiddleware, postController.index);
// show a single post
router.get('/:id', postController.show);
// store a new post
router.post('/', postController.store);
// update a post
router.put('/:id', postController.update);
// delete a post
router.delete('/:id', postController.delete);


module.exports = router;