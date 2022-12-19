const mongoose = require('mongoose')
const product = new mongoose.Schema ({
    Name : {
        type : String,
        required : true
    },
    Description : {
        type : String,
        required : true
    },
    Size : {
        type : String,
        required : true
    },
    Price : {
        type : String,
        required : true
    },
    Category : {
        type : String,
        required : true
    },
    Color : {
        type : String,
        required : true
    },
    Image1 : {
        type : String,
        required : true
    },
    Image2 : {
        type : String
       
    },
    Image3 : {
        type : String
        
    },
    Image4 : {
        type : String
        
    },
    Image5 : {
        type : String
        
    },
    active : {
        type : Boolean,
        default : true
    }

})

const newProduct = new mongoose.model('productDetails',product)
module.exports = newProduct