const Register = require("../src/models/database");
const newProduct = require("../src/models/products");
const newCategory = require('../src/models/category')

function adminsignin(req, res) {
  if (req.session.admin) {
    res.redirect("/adminredirect");
  } else {
    res.render("adminsignin");
  }
}

function adminsignin2(req, res) {
  if (req.session.admin) {
    res.render("adminwelcome");
  } else {
    res.redirect("/adminlogin");
  }
}

function adminPostSignin(req, res) {
  try {
    const email = "admin@gmail.com";
    const password = 123;
    if (email == req.body.email && password == req.body.password) {
      req.session.admin = req.body.email;
      console.log("admin session created");
      res.redirect("/adminredirect");
    } else {
      res.render("adminsignin", { error: "invalid login details" });
    }
  } catch (error) {
    res.render("adminsignin", { error: "invalid login details" });
  }
}

async function userdetails(req, res) {
  if (req.session.admin) {
    // const save = Register.find({}, (err, logindetails) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     res.render("admin-userdetails", { details: logindetails });
    //   }
    // });

    const details = await Register.find({})
    res.render("admin-userdetails", { details });
    console.log(details);
  } else {
    res.redirect("/adminlogin");
  }
}

async function productDetail(req, res) {
    // if(req.session.admin){
    // const products = newProduct.find({}, (err, productDetails)  => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         res.render("admin-ProductDetails", { details : productDetails} );
    //     }
    // })   
    const details = await newProduct.find({})
    
    res.render('admin-productDetails', {details})
}

async function addProduct(req, res) {
    const category = await newCategory.find({})
    res.render("admin-addProduct",{category});
}

function postAddProduct(req, res) {
    const product = {
        Name : req.body.name,
        Description : req.body.description,
        Size : req.body.size,
        Price : req.body.price,
        Category : req.body.category,
        Color : req.body.color,
        Image1 : req.file.filename
    }
     newProduct.insertMany([product])
    res.redirect('/productDetail')


}

module.exports = {
  adminsignin,
  adminsignin2,
  adminPostSignin,
  userdetails,
  productDetail,
  addProduct,
  postAddProduct,
};
