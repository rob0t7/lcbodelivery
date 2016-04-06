var stripe = require('stripe')("sk_test_ImiShRAViHIqyxDE86hQrfAA");
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/charges', function(req, res, next) {
  var token = req.body.token;
  var product = req.body.product;
  var price = Number(req.body.price);

  // Call the Stripe Charge API
  stripe.charges.create({
    amount: price,
    description: product,
    currency: 'cad',
    source: token
  }, function(err, charge) {
    res.json({status: 200, 'charge_id': charge.id, price: price, product: product});
  });


});

module.exports = router;
