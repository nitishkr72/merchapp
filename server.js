const express = require('express');
const app = express();
const stripe = require('stripe')(
  'sk_test_51KP0OALGEyT9T908osoVeWhMnrKSg6YibXTA84rLY5gGWvahr3uHZhAjKGXFicuNgPbZv2uYhIiylKsDHpKBcNuz00da02MYkB',
);

app.use(express.static('.'));
app.use(express.json());

// An endpoint for your checkout
app.post('/create-payment-intent', async (req, res) => {
  // Create or retrieve the Stripe Customer object associated with your user.
  let customer = await stripe.customers.create(); // This example just creates a new Customer every time
  // Create an ephemeral key for the Customer; this allows the app to display saved payment methods and save new ones
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2020-08-27'},
  );

  // const {items} = req.body;
  // Create a PaymentIntent with the payment amount, currency, and customer
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount * 100,
      currency: 'usd',
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      //payment_method_types: ['klarna'],
    });

    // Send the object keys to the client
    res.send({
      clientSecret: paymentIntent.client_secret,
      customer: customer.id,
      ephemeralKey: ephemeralKey.secret,
    });
  } catch (err) {
    return res.status(400).send({
      error: {
        message: err.message,
      },
    });
  }
});

app.listen(4242, () => console.log(`Node server listening on port !`));
