const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    _id:{
        type:String,
    },
    email: {
        type: String,
        requred: true
    },
    title: {
        type: String,
        requred: true
    },
    desc: {
        type: String,
        requred: true
    },
    type: {
        type: String,
        default:"personal"
    },
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);