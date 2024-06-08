const express = require("express")
const { post } = require("../models/post")
const { user } = require("../models/user")
const router = express.Router()

//Universal Home page
router.get("/", async (req, res) => {
    const allPosts = await post.find({})
    res.render("index", {
        posts: allPosts,
    })
})

//Rendering the contact us page
router.get("/contact", async (req, res) => {
    res.render("contact")
})

//Rendering the about us page
router.get("/about", async (req, res) => {
    res.render("about")
})

module.exports = router