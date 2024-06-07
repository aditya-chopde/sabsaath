const cookieParser = require("cookie-parser")
const express = require("express")
const app = express()
const path = require("path");
const { connectDb } = require("./connect");
const PORT = 3000;
const { restrictToLogedInUserOnly, checkAuth } = require("./middlewares/auth")
const { setUser } = require("./service/auth");
const { name } = require("ejs");
const auth = require("./routes/auth")
const admin = require("./routes/admin")
const posts = require("./routes/posts")
const static = require("./routes/static")

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

//Routes
app.use("/", static)
app.use("/auth", auth)
app.use("/admin", admin)
app.use("/post", posts)

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})