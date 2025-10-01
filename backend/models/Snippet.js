
const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});

const Snippet = mongoose.model('Snippet', snippetSchema);

module.exports = Snippet;
