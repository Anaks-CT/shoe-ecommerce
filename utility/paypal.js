const paypal = require('paypal-rest-sdk');
const Register = require('../src/models/database')
const coupon = require('../src/models/coupon')
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AZpBGzCJHdNSn2MRqlhLctThU5uj3xIJ8ZCN4ae0XaeTIYWOM0IoV9GgREpTPDEu4xjHV2fkkvYR9s2S',
    'client_secret': 'EF5GWkfwo2vNzPQYpHUf6IFPIPYIWQ80SYFe02B2AQ_jn8lro3iGLaZ7cb42bOV3s8PBiwHyUCkZzHmf'
  });

const paypalgate = async (req,res) =>{
    const orderDetialsId = req.query.orderDetials
    console.log(orderDetialsId);
    const user = await Register.findOne({ Email: req.session.user });
    const totalPrice = user.cart.totalPrice;
    const discount = req.query.discount
    let finalPrice = (totalPrice-discount)

    const create_payment_json = {
        "intent": "sale",
        "payer": {
          "payment_method": "paypal"
        },
        "redirect_urls": {
      "return_url": "http://runinstyle.co/checkout/placeOrder/"+orderDetialsId,
          "cancel_url": "http://runinstyle.co/checkoutPage"
        },
        "transactions": [{
          "item_list": {
            "items": [{
              "name": "item",
              "sku": "item",
              "price": finalPrice,
              "currency": "USD",
              "quantity": 1
            }]
          },
          "amount": {
            "currency": "USD",
            "total": finalPrice
          },
          "description": "This is the payment description."
        }]
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
    
  }





module.exports = {
    paypalgate
}