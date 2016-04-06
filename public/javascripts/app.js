// Setup Global APIs
var LCBOKEY = 'MDphMmIxNDY0Mi0zYjYwLTExZTUtYTRlOS1hZjBkOWE1YzRmYzI6WWRZR1h6Q0ZwQk9JNG00YTJMcHBsOFNxcUxjeklpTmVEWGlz';
Stripe.setPublishableKey('REPLACEME');

// LCBO Search related functions
var searchLCBO = function(productName) {
  var $resultTable = $('#product-search-results table tbody');

  // Fetch data from LCBOapi
  $.ajax({
    url: 'https://lcboapi.com/products',
    headers: { 'Authorization': 'Token ' + LCBOKEY },
    data: { q: productName }
  }).done(function(res) {
    // Remove previous results
    $resultTable.html('');

    // Parse results from the LCBO server
    var products = res.result;
    products.forEach(function(product) {
      var html = "<tr>";
      html += '<td class="name">' + product.name + '</td>';
      html += '<td>' + product.producer_name + "</td>";
      html += '<td class="price">' + product.price_in_cents + "</td>";
      html += '<td><button>Purchase</button></td>';
      $resultTable.append(html);
    });
  });
};

var showPaymentForm = function(event) {
  if (event.target.tagName !== 'BUTTON') {
    return;
  }
  // Fetch the product name and price from the item selected
  var $el = $(event.target);
  var parent = $el.closest('tr');
  var productName = parent.find('.name').text();
  var productPrice = parent.find('.price').text();

  // show the payment form with the product filled out
  $('#product').val(productName);
  $('#price').val(productPrice);
  $('#payment-form').removeClass('hidden');
  $('html, body').animate({
    scrollTop: $('#payment-form').offset().top
  }, 1000);
};

// Stripe related code
var parsePaymentForm = function () {
  var cardNumber = $("#card-number").val();
  var cardExpMonth = $("#card-exp-month").val();
  var cardExpYear = $("#card-exp-year").val();
  var cardCVC = $('#card-cvc').val();

  return {
    number: cardNumber,
    exp_month: cardExpMonth,
    exp_year:  cardExpYear,
    cvc: cardCVC
  };
}

var stripeHandler = function(status, data) {
  var cardToken = data.id;

  // Call our server with the stripe card token and product info
  $.ajax({
    url: '/api/charges',
    data: {
      token: cardToken,
      product: $('#product').val(),
      price:   $('#price').val()
    },
    method: 'POST'
  }).done(function(data) {
    var msg = "Successfully bougth ";
    msg += data.product + ' for ';
    msg += data.price + '!';
    alert(msg);
  });
};

$(document).ready(function() {

  // Product Search Event Handler
  $('#product-form').on('submit', function(event){
    var productName = $('#product-name').val();
    searchLCBO(productName);
  });

  // Buy event handler
  $('#product-search-results table').on('click', showPaymentForm);

  // Handle credit card payment form
  $('#payment-form').on('submit', function(event) {
    event.preventDefault();
    var formData = parsePaymentForm();
    Stripe.card.createToken(formData, stripeHandler);
  });

  // Live validation
  // $('#card-number').on('keyup', function(event) {
  //   var $numberField = $(this);
  //   var $parentField = $numberField.parent();
  //   var valid = Stripe.card.validateCardNumber($numberField.val());
  //   if (valid) {
  //     $parentField.find('.help-block').remove();
  //     $parentField.removeClass('has-error');
  //     $parentField.addClass('has-success');
  //   } else {
  //     $parentField.removeClass('has-success');
  //     $parentField.addClass('has-error');
  //     $parentField.append("<span class='help-block'>Invalid Card Number</span>");
  //   }
  // });
});
