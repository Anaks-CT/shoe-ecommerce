const multer = require('multer');
const { dirname } = require('path');
const path = require('path')

//multer setup
const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, path.join(__dirname,'../public/images/productImage'))
    },
    filename : (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage : storage})

module.exports = upload