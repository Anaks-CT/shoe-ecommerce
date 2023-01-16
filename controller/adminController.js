const Register = require("../src/models/database");
const newProduct = require("../src/models/products");
const newCategory = require("../src/models/category");
const coupon = require("../src/models/coupon");
const order = require("../src/models/order");
const banner = require("../src/models/banner");

async function adminsignin(req, res) {
  if (req.session.admin) {
    res.redirect("/adminredirect");
  } else {
    let cartDetails;
    if (req.session.user) {
      const user = await Register.findOne({ Email: req.session.user });
      cartDetails = user.cart.totalQty;
    } else {
      cartDetails = null;
    }
    if (cartDetails == 0) {
      cartDetails = null;
    }
    res.render("adminsignin", { cartDetails });
  }
}



function adminPostSignin(req, res) {
  try {
    const email = "admin@gmail.com";
    const password = 123;
    if (email == req.body.email && password == req.body.password) {
      req.session.admin = req.body.email;
      res.redirect("/adminDashboard");
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
  const bannerDetails = await banner.find({});
  res.render("admin-productDetails", { details, bannerDetails });
}

async function addProduct(req, res) {
  const category = await newCategory.find({});
  res.render("admin-addProduct", { category });
}

async function postAddProduct(req, res) {
  const product = {
    Name: req.body.name,
    Description: req.body.description,
    Price: req.body.price,
    Category: req.body.category,
    Color: req.body.color,
    stock: {
      small: req.body.smallStock,
      medium: req.body.mediumStock,
      large: req.body.largeStock,
      x_large: req.body.XLstock,
      xx_large: req.body.XXLstock,
      total:
        req.body.smallStock*1 +
        req.body.mediumStock*1 +
        req.body.largeStock*1 +
        req.body.XLstock*1 +
        req.body.XXLstock*1,
    },
    Image1: req.files.image[0].filename,
    Image2: req.files.image2[0].filename,
    Image3: req.files.image3[0].filename,
    Image4: req.files.image4[0].filename,
    Image5: req.files.image5[0].filename,
    Image6: req.files.image6[0].filename,
  };
  await newProduct.insertMany([product]);
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
  const total = req.body.smallStock*1 +
  req.body.mediumStock*1 +
  req.body.largeStock*1 +
  req.body.XLstock*1 +
  req.body.XXLstock*1
  await newProduct.updateOne(
    { _id: req.body.idd },
    {
      $set: {
        Name: req.body.name,
        Description: req.body.description,
        Price: req.body.price,
        Category: req.body.category,
        Color: req.body.color,
        stock: {
          small: req.body.smallStock,
          medium: req.body.mediumStock,
          large: req.body.largeStock,
          x_large: req.body.XLstock,
          xx_large: req.body.XXLstock,
          total: total
        },
      },
    }
  );
  res.redirect("/productDetail");
}
async function editProductImages (req,res){
  let id = req.query.id;
  const product = await newProduct.findById({ _id: id });
  res.render("admin-editProductImages", { product });
}
async function postEditImages (req,res){
  await newProduct.updateOne(
    { _id: req.body.idd },
    {
      $set: {
        Image1: req.files.image[0].filename,
        Image2: req.files.image2[0].filename,
        Image3: req.files.image3[0].filename,
        Image4: req.files.image4[0].filename,
        Image5: req.files.image5[0].filename,
        Image6: req.files.image6[0].filename,
        },
      },
  )
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
    res.send(error);
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

async function couponPage(req, res) {
  const coupons = await coupon.find({});
  res.render("admin-couponPage", { coupons });
}
async function addCoupon(req, res) {
  res.render("admin-addCoupon");
}
async function postAddCoupon(req, res) {
  const newCoupon = new coupon({
    name: req.body.name,
    code: req.body.code,
    discount: req.body.discount,
    startingDate: req.body.startingDate,
    expiryDate: req.body.expiryDate,
  });
  console.log(req.body.name);
  await newCoupon.save();
  res.redirect("coupons");
}
async function reactivateCoupon(req, res) {
  const id = req.query.id;
  await coupon.updateOne({ _id: id }, { $set: { active: true } });
  res.redirect("/coupons");
}
async function deactivateCoupon(req, res) {
  const id = req.query.id;
  await coupon.updateOne({ _id: id }, { $set: { active: false } });
  res.redirect("/coupons");
}
async function orderList(req, res) {
  const orderDetails = await order.find({}).populate("customer")
  res.render("admin-orderList", { orderDetails });
}
async function orderDetail(req, res) {
  const orderID = req.query.orderID;
  const orderDetails = await order
    .findOne({ _id: orderID })
    .populate("customer");
  console.log(orderDetails);
  res.render("admin-orderDetail", { orderDetails });
}
async function orderDelivered(req, res) {
  const orderID = req.query.orderID;
  await order.updateOne(
    { _id: orderID },
    { $set: { deliveryStatus: true, delivaryDate: Date.now() } }
  );
  res.redirect("/orderList/orderDetail?orderID=" + orderID);
}

async function adminDashboard(req, res) {
  const customerCount = await Register.find()
  const productCount = await newProduct.find()
  const orderCount = await order.find().populate("orderItems.productID")
  let totalAmount=0
  // console.log(orderCount[1].orderItems[0].productID.Category);
  orderCount.forEach(element => { 
    totalAmount = element.paidAmount+totalAmount
  });
  let menTotalAmount = 0
  let womenTotalAmount = 0
  console.log(orderCount.length);
  if(orderCount.length!=0){ 
    for(let i=0; i<orderCount.length; i++){
      for(let j=0; j<orderCount[i].orderItems.length; j++){
        if(orderCount[i].orderItems[j].productID.Category=="Men"){
              menTotalAmount =  orderCount[i].orderItems[j].totalPrice + menTotalAmount
            }else if (orderCount[i].orderItems[j].productID.Category == "Women"){
              womenTotalAmount = orderCount[i].orderItems[j].totalPrice + womenTotalAmount
            }
      }
    }
  }
  res.render("admin-dashboard",{customerCount,productCount,orderCount,totalAmount,womenTotalAmount,menTotalAmount});
}

async function bannerPage(req, res) {
  const banners = await banner.find({}).populate("product");
  
  res.render("admin-banner", { banners });
}
async function addToBanner(req, res) {
  const productId = req.query.productId;
  const productCheck = await banner.findOne({ product: productId });
  if (!productCheck) {
    const bannerProduct = new banner({
      product: productId,
    });
    await bannerProduct.save();
    console.log(productCheck);
      const productDetail = await newProduct.findOne({ _id: productId });
    if(productDetail.active == true){
      await banner.updateOne(
        { product: productId },
        {
          $set: {
            image: productDetail.Image6,
            price: productDetail.Price,
            description : "The wait is over. A beautiful blend of design and technology in every step of your running.",
            brand : 'NIKE'
          },
        }
      );
      await banner.updateMany(
        { active: true },
        {
          $set: {
            active: false,
          },
        }
      );
      await banner.updateOne(
        { product: productId },
        {
          $set: {
            active: true,
          },
        }
      );
    }else{
      await banner.updateOne(
        { product: productId },
        {
          $set: {
            image: productDetail.Image6,
            price: productDetail.Price,
            description : "The wait is over. A beautiful blend of design and technology in every step of your running.",
            brand : 'NIKE',
            list : false
          },
        }
      );
    }
    
  }

  res.json({ status: true });
}
async function editBanner(req, res) {
  const bannerId = req.query.bannerId;
  const bannerDetails = await banner.findOne({ _id: bannerId });
  res.render("admin-editBanner", { bannerDetails });
}
async function postEditBanner(req, res) {
  const bannerId = req.body.idd;
  console.log(bannerId);
  await banner.updateOne(
    { _id: bannerId },
    {
      $set: {
        brand: req.body.brand,
        description: req.body.description,
      },
    }
  );
  res.redirect("/banner");
}
async function setBanner(req, res) {
  const bannerId = req.query.bannerId;
  await banner.updateMany(
    { active: true },
    {
      $set: {
        active: false,
      },
    }
  );
  await banner.updateOne(
    { _id: bannerId },
    {
      $set: {
        active: true,
      },
    }
  );
  res.redirect("/banner");
}

async function deleteBanner(req, res) {
  const bannerId = req.query.bannerId;
  await banner.deleteOne({ _id: bannerId });
  res.redirect("/banner");
}
async function unlistProduct(req, res) {
  const productId = req.query.id;
  await newProduct.updateOne(
    { _id: productId },
    {
      $set: {
        active: false,
      },
    }
  );
  const bannerCheck = await banner({product : productId})
  if(bannerCheck){
    await banner.updateOne({product : productId},{
      $set : {
        list : false
      }
    })
  }
  res.json({});
}
async function listProduct(req, res) {
  const productId = req.query.id;
  await newProduct.updateOne(
    { _id: productId },
    {
      $set: {
        active: true,
      },
    }
  );
  const bannerCheck = await banner({product : productId})
  if(bannerCheck){
    await banner.updateOne({product : productId},{
      $set : {
        list : true
      }
    })
  }
  res.json({ success: true });
}

module.exports = {
  adminsignin,
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
  couponPage,
  addCoupon,
  postAddCoupon,
  reactivateCoupon,
  deactivateCoupon,
  orderList,
  orderDetail,
  orderDelivered,
  adminDashboard,
  bannerPage,
  addToBanner,
  editBanner,
  postEditBanner,
  setBanner,
  deleteBanner,
  unlistProduct,
  listProduct,
  editProductImages,
  postEditImages
};
