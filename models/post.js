const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
}, {
    timestamps: true
})

const post = mongoose.model("post", postSchema)

module.exports = {
    post
}