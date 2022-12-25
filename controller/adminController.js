const Register = require("../src/models/database");
const newProduct = require("../src/models/products");
const newCategory = require("../src/models/category");

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
    const details = await Register.find({});
    res.render("admin-userdetails", { details });
  } else {
    res.redirect("/adminlogin");
  }
}

async function productDetail(req, res) {
  const details = await newProduct.find({});
  res.render("admin-productDetails", { details });
}

async function addProduct(req, res) {
  const category = await newCategory.find({});
  res.render("admin-addProduct", { category });
}

async function postAddProduct(req, res) {
  const category = await newCategory.find({});
  res.render("admin-addProduct", {
    error: "product aldready present",
    category,
  });
  const product = {
    Name: req.body.name,
    Description: req.body.description,
    Size: req.body.size,
    Price: req.body.price,
    Category: req.body.category,
    Color: req.body.color,
    Image1: req.file.filename,
  };
  newProduct.insertMany([product]);
  res.redirect("/productDetail");
}

async function categoryDetails(req, res) {
  const category = await newCategory.find({});
  res.render("admin-categoryDetails", { category });
}

function addCategory(req, res) {
  res.render("admin-addCategory");
}

async function postAddCategory(req, res) {
  const currentCategory = newCategory.find({ Name: req.body.name });
  if (currentCategory) {
    res.render("admin-addCategory", {
      error: "    category aldready present!",
    });
  } else {
    const category = {
      Name: req.body.name,
    };
    await newCategory.insertMany([category]);
    res.redirect("/categoryDetails");
  }
}

async function editProduct(req, res) {
  let id = req.query.id;
  const category = await newCategory.find({});
  const product = await newProduct.findById({ _id: id });
  res.render("admin-editProduct", { product, category });
}

async function post_editProduct(req, res) {
  await newProduct.updateOne(
    { _id: req.body.idd },
    {
      $set: {
        Name: req.body.name,
        Description: req.body.description,
        Size: req.body.size,
        Price: req.body.price,
        Category: req.body.category,
        Color: req.body.color,
        Image1: req.file.filename,
      },
    }
  );
  res.redirect("/productDetail");
}

async function blockUser(req, res) {
  let id = req.query.id;
  await Register.updateOne(
    { _id: id },
    {
      $set: {
        active: false,
      },
    }
  );
  res.redirect("/userdetails");
}

async function unblockUser(req, res) {
  let id = req.query.id;
  await Register.updateOne(
    { _id: id },
    {
      $set: {
        active: true,
      },
    }
  );
  res.redirect("/userdetails");
}

async function blockCategory(req, res) {
  try {
    const name = req.query.name;
  await newCategory.updateOne(
    { Name: name },
    {
      $set: {
        active: false,
      },
    }
  );
  res.redirect("/categoryDetails");
  } catch (error) {
    res.send(error)
  }
  
}

async function unblockCategory(req, res) {
  const name = req.query.name;
  await newCategory.updateOne(
    { Name: name },
    {
      $set: {
        active: true,
      },
    }
  );
  res.redirect("/categoryDetails");
}

module.exports = {
  adminsignin,
  adminsignin2,
  adminPostSignin,
  userdetails,
  productDetail,
  addProduct,
  postAddProduct,
  categoryDetails,
  addCategory,
  postAddCategory,
  editProduct,
  post_editProduct,
  blockUser,
  unblockUser,
  blockCategory,
  unblockCategory,
};
