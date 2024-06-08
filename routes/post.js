const express = require("express")
const { user } = require("../models/user");
const jwt = require("jsonwebtoken");
const secret_key = "secret12334"
const { post } = require("../models/post");

const router = express.Router()

//Creating the user post
router.post("/create", async (req, res) => {
    const { title, description } = req.body;
    const verify = jwt.verify(req.cookies.token, secret_key)
    const findUser = await user.findOne({
        email: verify.email
    })

    const createPost = await post.create({
        title: title,
        description: description,
        createdBy: findUser._id,
        userName: findUser.name
    })

    res.send({ msg: "post created" })
})

module.exports = router;