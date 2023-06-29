const express = require('express')
const mongoose = require('mongoose')
const app = express()
const Product = require('./models/Product')
const port = 5000
app.use(express.json({ extended: true }))
app.use(express.urlencoded())


mongoose.connect('mongodb+srv://scor32k:scor32k@cluster0.cw5duyv.mongodb.net/fetchputmym').then(() => {
    console.log("connected");
    // scorcism
})
    .catch((error) => {
        console.log("error: ", error)
    })

app.get('/', (req, res) => {
    res.sendFile('pages/index.html', { root: __dirname })
})

app.get('/fetchstore', async (req, res) => {

    try {

        const result = await fetch('https://dummyjson.com/products');
        const json = await result.json();
        let products = json.products;

        products.map(async (item) => {

            let title = item.title;
            let description = item.description;
            let price = item.price;
            let discountPercentage = item.discountPercentage;
            let rating = item.rating;
            let stock = item.stock;
            let brand = item.brand;
            let category = item.category;
            let thumbnail = item.thumbnail;

            let _product = await Product.create({
                title,
                description,
                price,
                discountPercentage,
                rating,
                stock,
                brand,
                category,
                thumbnail
            })

        })


        res.status(200).json({ status: 1, message: "Fetched" })
    } catch (error) {
        console.error(error);
        res.status(501).json({ status: 0, message: "Internal server error" })
    }


})

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})