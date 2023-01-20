const Register = require("../src/models/database");
const newProduct = require("../src/models/products");
const newCategory = require("../src/models/category");
const coupon = require("../src/models/coupon");
const order = require("../src/models/order");
const banner = require("../src/models/banner");
const moment = require('moment')

async function adminsignin(req, res) {
  try {
    if (req.session.admin) {
      res.redirect("/adminDashboard");
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
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function adminPostSignin(req, res) {
  try {
    const email = "admin@gmail.com";
    const password = 9349883260;
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
    if (email == req.body.email && password == req.body.password) {
      req.session.admin = req.body.email;
      res.redirect("/adminDashboard");
    } else {
      res.render("adminsignin", {
        error: "invalid login details",
        cartDetails,
      });
    }
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function userdetails(req, res) {
  try {
    if (req.session.admin) {
      const details = await Register.find({});
      res.render("admin-userdetails", { details });
    } else {
      res.redirect("/adminlogin");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function productDetail(req, res) {
  try {
    const details = await newProduct.find({});
    const bannerDetails = await banner.find({});
    res.render("admin-productDetails", { details, bannerDetails });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function addProduct(req, res) {
  try {
    const category = await newCategory.find({});
    res.render("admin-addProduct", { category });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function postAddProduct(req, res) {
  try {
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
          req.body.smallStock * 1 +
          req.body.mediumStock * 1 +
          req.body.largeStock * 1 +
          req.body.XLstock * 1 +
          req.body.XXLstock * 1,
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
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function categoryDetails(req, res) {
  try {
    const category = await newCategory.find({});
    res.render("admin-categoryDetails", { category });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

function addCategory(req, res) {
  try {
    res.render("admin-addCategory");
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function postAddCategory(req, res) {
  try {
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
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function editProduct(req, res) {
  try {
    let id = req.query.id;
    const category = await newCategory.find({});
    const product = await newProduct.findById({ _id: id });
    res.render("admin-editProduct", { product, category });
  } catch (error) {}
}

async function post_editProduct(req, res) {
  try {
    const total =
      req.body.smallStock * 1 +
      req.body.mediumStock * 1 +
      req.body.largeStock * 1 +
      req.body.XLstock * 1 +
      req.body.XXLstock * 1;
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
            total: total,
          },
        },
      }
    );
    res.redirect("/productDetail");
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}
async function editProductImages(req, res) {
  try {
    let id = req.query.id;
    const product = await newProduct.findById({ _id: id });
    res.render("admin-editProductImages", { product });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}
async function postEditImages(req, res) {
  try {
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
      }
    );
    res.redirect("/productDetail");
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function blockUser(req, res) {
  try {
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
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function unblockUser(req, res) {
  try {
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
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
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
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function unblockCategory(req, res) {
  try {
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
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function couponPage(req, res) {
  try {
    const coupons = await coupon.find({});
    res.render("admin-couponPage", { coupons,moment });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}
async function addCoupon(req, res) {
  try {
    res.render("admin-addCoupon");
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}
async function postAddCoupon(req, res) {
  try {
    const newCoupon = new coupon({
      name: req.body.name,
      code: req.body.code,
      discount: req.body.discount,
      startingDate: req.body.startingDate,
      expiryDate: req.body.expiryDate,
    });
    await newCoupon.save();
    res.redirect("coupons");
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}
async function reactivateCoupon(req, res) {
  try {
    const id = req.query.id;
    await coupon.updateOne({ _id: id }, { $set: { active: true } });
    res.redirect("/coupons");
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}
async function deactivateCoupon(req, res) {
  try {
    const id = req.query.id;
    await coupon.updateOne({ _id: id }, { $set: { active: false } });
    res.redirect("/coupons");
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}
async function orderList(req, res) {
  try {
    const orderDetails = await order.find({}).populate("customer");
    res.render("admin-orderList", { orderDetails,moment });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}
async function orderDetail(req, res) {
  try {
    const orderID = req.query.orderID;
    const orderDetails = await order
      .findOne({ _id: orderID })
      .populate("customer");
    res.render("admin-orderDetail", { orderDetails,moment });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}
async function orderDelivered(req, res) {
  try {
    const orderID = req.query.orderID;
    await order.updateOne(
      { _id: orderID },
      { $set: { deliveryStatus: true, delivaryDate: Date.now() } }
    );
    res.redirect("/orderList/orderDetail?orderID=" + orderID);
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function adminDashboard(req, res) {
  try {
    const customerCount = await Register.find().count()
    const productCount = await newProduct.find().count()
    const orders = await order.find().populate("orderItems.productID");
    let totalAmount = 0;
    orders.forEach((element) => {
      totalAmount = element.paidAmount + totalAmount;
    });
    
    res.render("admin-dashboard", {
      customerCount,
      productCount,
      orders,
      totalAmount,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function bannerPage(req, res) {
  try {
    const banners = await banner.find({}).populate("product");
    res.render("admin-banner", { banners });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}
async function addToBanner(req, res) {
  try {
    const productId = req.query.productId;
    const productCheck = await banner.findOne({ product: productId });
    if (!productCheck) {
      const bannerProduct = new banner({
        product: productId,
      });
      await bannerProduct.save();
      const productDetail = await newProduct.findOne({ _id: productId });
      if (productDetail.active == true) {
        await banner.updateOne(
          { product: productId },
          {
            $set: {
              image: productDetail.Image6,
              price: productDetail.Price,
              description:
                "The wait is over. A beautiful blend of design and technology in every step of your running.",
              brand: "NIKE",
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
      } else {
        await banner.updateOne(
          { product: productId },
          {
            $set: {
              image: productDetail.Image6,
              price: productDetail.Price,
              description:
                "The wait is over. A beautiful blend of design and technology in every step of your running.",
              brand: "NIKE",
              list: false,
            },
          }
        );
      }
    }

    res.json({ status: true });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}
async function editBanner(req, res) {
  try {
    const bannerId = req.query.bannerId;
    const bannerDetails = await banner.findOne({ _id: bannerId });
    res.render("admin-editBanner", { bannerDetails });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}
async function postEditBanner(req, res) {
  try {
    const bannerId = req.body.idd;
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
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}
async function setBanner(req, res) {
  try {
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
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function deleteBanner(req, res) {
  try {
    const bannerId = req.query.bannerId;
    await banner.deleteOne({ _id: bannerId });
    res.redirect("/banner");
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}
async function unlistProduct(req, res) {
  try {
    const productId = req.query.id;
    await newProduct.updateOne(
      { _id: productId },
      {
        $set: {
          active: false,
        },
      }
    );
    const bannerCheck = await banner({ product: productId });
    if (bannerCheck) {
      await banner.updateOne(
        { product: productId },
        {
          $set: {
            list: false,
          },
        }
      );
    }
    res.json({});
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}
async function listProduct(req, res) {
  try {
    const productId = req.query.id;
    await newProduct.updateOne(
      { _id: productId },
      {
        $set: {
          active: true,
        },
      }
    );
    const bannerCheck = await banner({ product: productId });
    if (bannerCheck) {
      await banner.updateOne(
        { product: productId },
        {
          $set: {
            list: true,
          },
        }
      );
    }
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function graphData(req, res) {
  try {
    let currentYear = new Date();
    currentYear = currentYear.getFullYear();
    const orderData = await order.aggregate([
      {
        $project: {
          _id: 0,
          totalProducts: "$totalQty",
          billAmount: "$paidAmount",
          month: {
            $month: "$orderDate",
          },
          year: {
            $year: "$orderDate",
          },
        },
      },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          totalProducts: { $sum: "$totalProducts" },
          totalOrders: { $sum: 1 },
          revenue: {
            $sum: "$billAmount",
          },
          avgBillPerOrder: {
            $avg: "$billAmount",
          },
        },
      },
      {
        $match: {
          "_id.year": currentYear,
        },
      },
      {
        $sort: { "_id.month": 1 },
      },
    ]);
    const orders = await order.find().populate("orderItems.productID");
    let menTotalAmount = 0;
    let womenTotalAmount = 0;
    if (orders.length != 0) {
      for (let i = 0; i < orders.length; i++) {
        for (let j = 0; j < orders[i].orderItems.length; j++) {
          if (orders[i].orderItems[j].productID.Category == "Men") {
            menTotalAmount =
              orders[i].orderItems[j].totalPrice + menTotalAmount;
          } else if (
            orders[i].orderItems[j].productID.Category == "Women"
          ) {
            womenTotalAmount =
              orders[i].orderItems[j].totalPrice + womenTotalAmount;
          }
        }
      }
    }
    console.log(menTotalAmount+'women'+womenTotalAmount);
    res.json({
      data: {
        orderData,
        menTotalAmount,
        womenTotalAmount
      },
    });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

module.exports = {
  graphData,
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
  postEditImages,
};
