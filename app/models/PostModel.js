const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    CreatedAt: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model('Post', PostSchema);
