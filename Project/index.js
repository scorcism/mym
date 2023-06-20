const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express()
const Note = require("./models/Note")
const User = require("./models/User")
const port = 3000
app.use(express.json({ extended: true }))
app.use(express.urlencoded())
const JWT_SECRET = "scorcimisscorcism"
mongoose.connect('mongodb+srv://scor32k:scor32k@cluster0.cw5duyv.mongodb.net/notes').then(() => {
    console.log("connected");
    // scorcism
})
    .catch((error) => {
        console.log("error: ", error)
    })

app.get('/', (req, res) => {
    res.sendFile('pages/index.html', { root: __dirname })
})

app.get('/login', (req, res) => {
    res.sendFile('pages/login.html', { root: __dirname })
})

app.get('/signup', (req, res) => {
    res.sendFile('pages/signup.html', { root: __dirname })
})

// APIs endpoint
app.get('/getnotes', async (req, res) => {
    let token = req.header("auth-token")

    if (!token) {
        return res.status(401).json({ success: false, message: "2Authenticate using valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        let useremail = data.user.email;
        console.log(useremail)
        try {
            console.log("in try try")
            let notes = await Note.find({ email: useremail })
            res.status(200).json({success: true, message:notes})
        } catch (error) {
            return res.status(401).json({ success: false, message: "1Authenticate using valid token" })
        }

    } catch (error) {
        return res.status(401).json({ success: false, message: "Internal server error" })
    }


})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email })
        // // console.log(user.email, user.password)

        if (!user) {
            return res.status(400).json({ success: false, message: "Check Credentials" })
        }

        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            return res.status(400).json({ success: false, message: "Check Credentials" });
        }

        let data = {
            user: {
                email: user.email
            }
        }

        let authtoken = jwt.sign(data, JWT_SECRET);

        res.status(200).json({ success: true, message: authtoken })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Check Credentials" });
    }
})

app.post('/signup', async (req, res) => {
    // console.log(req.body)
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ success: false, message: "User already exist" })
        }

        const salt = await bcrypt.genSaltSync(10);
        const secPassword = await bcrypt.hash(password, salt);

        user = await User.create({ email: email, password: secPassword });

        res.status(200).json({ success: true, message: user })

    } catch (error) {
        return res.status(400).json({ success: false, message: "Some Error occured" })
    }

})

app.post('/addnote', async (req, res) => {
    let token = req.header("auth-token")
    // console.log(token)
    if (!token) {
        return res.status(401).json({ success: false, message: "Authenticate using valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        let useremail = data.user.email;

        try {
            // console.log(req.body);
            // console.log(useremail);
            let newNote = await Note.create({ title: req.body.title, desc: req.body.title, type: req.body.type, email: useremail })

            res.status(200).json({ success: true, message: "Note added" })

        } catch (error) {
            return res.status(401).json({ success: false, message: "Authenticate using valid token" })
        }

    } catch (error) {
        return res.status(401).json({ success: false, message: "Authenticate using valid token" })
    }

})

app.get('/deletenote', (req, res) => {

    res.sendFile('pages/signup.html', { root: __dirname })
})


app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})