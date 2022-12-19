const mongoose = require('mongoose')
const Category = new mongoose.Schema({
    Name : {
        type : String,
    },
    active : {
        type : Boolean,
        default : true
    }
})
const newCategory = new mongoose.model('categoryDetail',Category)
module.exports = newCategory