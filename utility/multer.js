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
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(console.log("Multer Filter: Must upload an Image"), false);
    }
  };
  const upload = multer({ storage: storage, fileFilter: multerFilter });

module.exports = upload