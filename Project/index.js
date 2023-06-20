const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000
app.use(express.json({ extended: true }))
app.use(express.urlencoded())

mongoose.connect('mongodb+srv://scor32k:scor32k@cluster0.cw5duyv.mongodb.net/notes').then(()=>{
    console.log("connected");  
    // scorcism
})
.catch((error)=>{
    console.log("error: ", error )
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
app.get('/getnotes', (req, res) => {

    res.sendFile('pages/signup.html', { root: __dirname })
})

app.get('/login', (req, res) => {

    res.sendFile('pages/signup.html', { root: __dirname })
})

app.get('/signup', (req, res) => {

    res.sendFile('pages/signup.html', { root: __dirname })
})

app.get('/deletenoe', (req, res) => {

    res.sendFile('pages/signup.html', { root: __dirname })
})

app.get('/addnote', (req, res) => {

    res.sendFile('pages/signup.html', { root: __dirname })
})


app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})