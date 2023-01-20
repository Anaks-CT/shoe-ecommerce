const paypal = require("paypal-rest-sdk");
const Register = require("../src/models/database");
const coupon = require("../src/models/coupon");
paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AXxgb385M9x9huQ92gVjkdAZlsJlfjuOaQimQQlIE68VTIFJBu6l7EZZPlrwcMV9BWjtlc3HUT6dlEBp",
  client_secret:
    "EE8XlipR2U1Omg1Z-Bm0OeZbMpFfFNb5OU4p-qM-1ZJezOBUCJysWGL6xw72lzRbaa9x1Tlzqv_wnzpq",
});

const paypalgate = async (req, res) => {
  const orderDetialsId = req.query.orderDetials;
  console.log(orderDetialsId);
  const user = await Register.findOne({ Email: req.session.user });
  const totalPrice = user.cart.totalPrice;
  const discount = req.query.discount;
  let finalPrice = totalPrice - discount;

  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: `https://runinstyle.co/checkout/placeOrder/${orderDetialsId}`,
      cancel_url: "https://runinstyle.co/checkoutPage",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: `Order Number-${orderDetialsId}`,
              sku: `Order Number-${orderDetialsId}`,
              price: finalPrice,
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: finalPrice,
        },
        description: "runinstyle.",
      },
    ],
  };
  paypal.payment.create(create_payment_json, async function (error, payment) {
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.redirect(payment.links[i].href);
        }
      }
    }
  });
};

module.exports = {
  paypalgate,
};
