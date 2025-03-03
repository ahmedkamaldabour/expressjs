const Post = require('../../models/PostModel');
const apiResponse = require('../../helpers/apiResponse');


class PostController {

    // index of all posts
    async index(req, res) {
        try {
            //             const posts = await Post.find();
            const cursor = Post.find().cursor();
            const posts = [];
            await cursor.eachAsync(post => posts.push(post));
            return apiResponse(res, 200, 'Success', null, posts);
        } catch (err) {
            return apiResponse(res, 500, 'Error', err.message, null);
        }
    }

    // show a single post
    async show(req, res) {
        try {
            const post = await Post.findById(req.params.id);
            console.log(post);
            if (!post) {
                return apiResponse(res, 404, 'Not Found', 'Post not found', null);
            }
            return apiResponse(res, 200, 'Success', null, post);
        } catch (err) {
            return apiResponse(res, 500, 'Error', err.message, null);
        }
    }

    // store a new post
    async store(req, res) {
        try {
            const post = await Post.create(req.body);
            return apiResponse(res, 201, 'Success', null, post);
        } catch (err) {
            return apiResponse(res, 500, 'Error', err.message, null);
        }
    }

    // update a post
    async update(req, res) {
        try {
            const post = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true , runValidators: true});
            if (!post) {
                return apiResponse(res, 404, 'Not Found', 'Post not found', null);
            }
            return apiResponse(res, 200, 'Success', null, post);
        } catch (err) {
            return apiResponse(res, 500, 'Error', err.message, null);
        }
    }

    // delete a post
    async delete(req, res) {
        try {
            const post = await Post.findByIdAndDelete(req.params.id);
            if (!post) {
                return apiResponse(res, 404, 'Not Found', 'Post not found', null);
            }
            return apiResponse(res, 204, 'Success', null, null);
        } catch (err) {
            return apiResponse(res, 500, 'Error', err.message, null);
        }
    }

}

module.exports = new PostController();