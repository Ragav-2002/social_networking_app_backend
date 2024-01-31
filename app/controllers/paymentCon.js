const Payment = require('../models/paymentModel')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const User = require('../models/userModel')
const paymentCon = {} 

 paymentCon.pay = async (req , res) => {
    const {communityId, amount } = req.body


    try {
        // if (!req.body.currency) {
        //     throw new Error('Currency is not defined in the request body.');
        // }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [{
               
                price : process.env.STRIPE_PRICE_ID,
                quantity : 1
                
            }],
            success_url: process.env.SUCCESS_URL, // Replace with your actual success URL
            cancel_url: process.env.CANCEL_URL, // Replace with your actual cancel URL
            currency : 'inr',
            shipping_address_collection: {
                allowed_countries: ['IN'],
            },
           
            billing_address_collection: 'required', // Require billing address
        });

        console.log('session created', session);

        const payment = new Payment({
            userId: req.user.userId,
            communityId : communityId,
            amount : amount,
            method: 'Card',
            transactionId: session.id,
        });

        console.log(payment);

        const paymentDoc = await payment.save();
        
            await User.findByIdAndUpdate(req.user.userId , {$push : {premiumComs : communityId}})
       
        res.json({ url: session.url, id: session.id, payment });

    } catch (e) {
        res.status(500).json({errors : e.message})
    }
} 

module.exports = paymentCon