const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    desc: {
        type: String,
    },
    price: {
        type: Number,
    },
    discountPercentage: {
        type: Number,
    },
    rating: {
        type: Number,
    },
    stock: {
        type: Number,
    },
    brand: {
        type: String
    },
    category: {
        type: String
    },
    thumbnail: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);