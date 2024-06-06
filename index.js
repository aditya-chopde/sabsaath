const cookieParser = require("cookie-parser")
const express = require("express")
const app = express()
const path = require("path");
const { connectDb } = require("./connect");
const { user } = require("./models/user");
const PORT = 3000;
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { post } = require("./models/post");
const secret_key = "secret12334"
const { restrictToLogedInUserOnly, checkAuth } = require("./middlewares/auth")
const { setUser } = require("./service/auth");
const { name } = require("ejs");

//Connect DB
connectDb("mongodb://localhost:27017/handle-user").then(() => {
    console.log("DB Connected")
})

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))
app.use(cookieParser());

// Routes
app.get("/", async (req, res) => {
    res.render("index")
})

app.get("/signup", async (req, res) => {
    res.render("signup")
})

app.get('/logout', async (req, res) => {
    res.cookie("token", "")
    res.redirect("/login")
})

app.post("/create", async (req, res) => {
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
            return res.redirect("/user")
        });
    });
})

app.get("/user", async (req, res) => {
        const verify = jwt.verify(req.cookies.token, secret_key)
        const findUser = await user.findOne({
            email: verify.email
        })

        const findPosts = await post.find({
            createdBy: findUser._id
        })

        res.render("home", {
            name: findUser.name,
            posts: findPosts
        })
})

app.get("/login", async (req, res) => {
    res.render("login")
})

app.post("/login", async (req, res) => {
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
                res.redirect("/user")
                setUser(token, findUser)
            }
        });
    }
})

app.get("/admin", async (req, res) => {
    res.render("admin")
})

app.get("/contact", async (req, res) => {
    res.render("contact")
})

app.get("/about", async (req, res) => {
    res.render("about")
})

app.post("/checkadmin", async (req, res) => {
    let adminEmail = "admin@gmail.com";
    let adminPass = "admin";
    let getUsers = await user.find({})
    const { email, password } = req.body
    if (email == adminEmail && password == adminPass) {
        return res.render("adminpanel", {
            email: adminEmail,
            password: adminPass,
            users: getUsers,
        })
    } else {
        return res.send({ msg: "something went wrong" })
    }
})

app.post("/user/create", async (req, res) => {
    const { title, description } = req.body;
    const verify = jwt.verify(req.cookies.token, secret_key)
    const findUser = await user.findOne({
        email: verify.email
    })

    const createPost = await post.create({
        title: title,
        description: description,
        createdBy: findUser._id
    })

    res.send({ msg: "post created" })
})

app.get("/verify", async (req, res) => {
    let verify = jwt.verify(req.cookies.token, secret_key)
    let findUser = await user.findOne({
        email: verify.email
    })
    console.log(findUser._id)
    res.send({ msg: "verified" })
    // let verify = jwt.verify(res.cookie.token)
})

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})