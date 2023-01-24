const paypal = require("paypal-rest-sdk");
const Register = require("../src/models/database");
const coupon = require("../src/models/coupon");
paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AeflmT1fGOp74rfgOjw8wYVZ4YEwriS0i9UUPR1mN3abCNAUkYskayR-JgjVlXuoUrzzas9-Y-BpgCT-",
  client_secret:
    "EBIA-bqkG62DwwwGoZ0tZdkv4efKmKSqhU5yQo4DlNPvb5jaAWvU8JquoPr6rpgxHjS1dtIvADvvR8jF",
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
