const express = require("express")

const router = express.Router()

//Rendering the admin panel
router.get("/", async (req, res) => {
    res.render("admin")
})

//Logging in the admin
router.post("/checkadmin", async (req, res) => {
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

module.exports = router;