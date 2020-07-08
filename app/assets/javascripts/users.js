/* global $, Stripe */
//Document ready.
$(document).on('turbolinks:load', function(){
  var theForm = $('#pro_form'),
      submitBtn = $('#form-signup-btn');

  Stripe.setPublishableKey($('meta[name="stripe-key"]').attr('content'));

  submitBtn.click(function(event){
    event.preventDefault();
    submitBtn.val("Processing").prop('disabled', true);

    // Collect CC fields
    var ccNum = $('#card_number').val(),
        cvcNum = $('#card_code').val(),
        expMonth = $('#card_month').val(),
        expYear = $('#card_year').val();

    // Validate card information
    var error = false;
    if (!Stripe.card.validateCardNumber(ccNum)) {
      error = true;
      alert('The credit card number appears to be invalid');
    }
    if (!Stripe.card.validateCVC(cvcNum)) {
      error = true;
      alert('The security number appears to be invalid');
    }
    if (!Stripe.card.validateExpiry(expMonth, expYear)) {
      error = true;
      alert('The expiration date appears to be invalid');
    }

    if (error) {
      // Reset button
      submitBtn.val("Sign up").prop('disabled', false);
    } else {
      // Send information to Stripe
      Stripe.createToken({
        number: ccNum,
        cvc: cvcNum,
        exp_month: expMonth,
        exp_year: expYear
      }, stripeResponseHandler);
    }
    return false;
  });

  function stripeResponseHandler(status, response) {
    // get token from response
    var token = response.id;

    // inject card token in form as hidden field
    theForm.append($('<input type="hidden" name="user[stripe_card_token">')
                   .val(token));

    // submit form to rails app
    theForm.get(0).submit();
  }
});