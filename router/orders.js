const express = require("express");
const router = express.Router();
const stripe = require('stripe')(Secret_Key)


var Publishable_Key = 'Your_Publishable_Key'
var Secret_Key = 'Your_Secret_Key'

 
router.get('/', function(req, res){
    res.render('Home', {
       key: Publishable_Key
    })
})

 
router.post('/payment', function(req, res){

    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Amit',
        address: {
            line1: 'TC 9/4 Old MES colony',
            postal_code: '452331',
            city: 'Indore',
            state: 'Madhya Pradesh',
            country: 'India',
        }
    })
    .then((customer) => {
 
        return stripe.charges.create({
            amount: 2500,     // Charging Rs 25
            description: 'Web Development Product',
            currency: 'INR',
            customer: customer.id
        });
    })
    .then((charge) => {
        res.send("Success")  // If no error occurs
    })
    .catch((err) => {
        res.send(err)       // If some error occurs
    });
})
module.exports = router;