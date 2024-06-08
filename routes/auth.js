const express = require("express")
const secret_key = "secret12334"
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { post } = require("../models/post");
const { user } = require("../models/user");
const { setUser } = require("../service/auth");
const { isLoggedIn } = require("../controller/login");
const router = express.Router()

//Rendering the signup page
router.get("/signup", async (req, res) => {
    res.render("signup")
})

//Rendering the login page
router.get("/login", async (req, res) => {
    res.render("login")
}, isLoggedIn)

//Logging out the user
router.get('/logout', async (req, res) => {
    res.cookie("token", "")
    res.redirect("/auth/login")
})

//Creating the user
router.post("/create", async (req, res) => {
    const body = req.body

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, async function (err, hash) {
            let createUser = await user.create({
                name: body.name,
                email: body.email,
                password: hash,
            })
            let token = jwt.sign({
                email: body.email,
                password: hash,
            }, secret_key)

            res.cookie("token", token)
            return res.redirect("/auth/user")
        });
    });
})

//Logging in the user 
router.post("/login", async (req, res) => {
    let findUser = await user.findOne({
        email: req.body.email,
    })

    if (!findUser) {
        res.send({ msg: "Something went wrong" })
    } else {
        bcrypt.compare(req.body.password, findUser.password, function (err, result) {

            if (!result) {
                res.send({ msg: "Something went wrong" })
            } else {
                let token = jwt.sign({
                    email: findUser.email,
                    password: findUser.password
                }, secret_key)

                res.cookie("token", token)
                res.redirect("/auth/user")
                setUser(token, findUser)
            }
        });
    }
})


//Rendering the user profile home page
router.get("/user", isLoggedIn)

module.exports = router;