// import { NextApiRequest, NextApiResponse } from 'next'
// import Stripe from 'stripe'

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2022-11-15',

// })

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { amount } = req.body

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: 'inr',
//       payment_method_types: ['card', 'upi'],
//     })

//     res.status(200).send({ clientSecret: paymentIntent.client_secret })
//   } else {
//     res.status(405).end()
//   }
// }