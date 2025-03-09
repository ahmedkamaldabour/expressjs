const Post = require('../../models/PostModel');
const BaseController = require('./BaseController');
const APIFeatures = require("../../helpers/apiFeatures");

class PostController extends BaseController {

    // constructor method
    constructor() {
        super()
        // Bind methods to the instance
        this.index = this.index.bind(this);
        this.show = this.show.bind(this);
        this.store = this.store.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    // index of all posts
    async index(req, res) {
        try {
            const features = new APIFeatures(Post.find(), req.query)
                .filter()
                .sort()
                .limitFields()
                .paginate();
            const posts = await features.query;

            return this.apiResponse(res, 200, 'Success', null, posts);
        } catch (err) {
            return this.apiResponse(res, 500, 'Error', err.message, null);
        }
    }

    // show a single post
    async show(req, res) {
        try {
            const post = await Post.findById(req.params.id);
            console.log(post);
            if (!post) {
                return this.apiResponse(res, 404, 'Not Found', 'Post not found', null);
            }
            return this.apiResponse(res, 200, 'Success', null, post);
        } catch (err) {
            return this.apiResponse(res, 500, 'Error', err.message, null);
        }
    }

    // store a new post
    async store(req, res) {
        try {
            const post = await Post.create(req.body);
            return this.apiResponse(res, 201, 'Success', null, post);
        } catch (err) {
            return this.apiResponse(res, 500, 'Error', err.message, null);
        }
    }

    // update a post
    async update(req, res) {
        try {
            const post = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
            if (!post) {
                return this.apiResponse(res, 404, 'Not Found', 'Post not found', null);
            }
            return this.apiResponse(res, 200, 'Success', null, post);
        } catch (err) {
            return this.apiResponse(res, 500, 'Error', err.message, null);
        }
    }

    // delete a post
    async delete(req, res) {
        try {
            const post = await Post.findByIdAndDelete(req.params.id);
            if (!post) {
                return this.apiResponse(res, 404, 'Not Found', 'Post not found', null);
            }
            return this.apiResponse(res, 204, 'Success', null, null);
        } catch (err) {
            return this.apiResponse(res, 500, 'Error', err.message, null);
        }
    }

}

module.exports = new PostController();
