const dotenv = require("dotenv");
const axios = require("axios");
const stripe = require("stripe")("sk_test_51NHUo0IXBDZqa5GLMa0CdC07H5SPA5EUK8mRurNvlLUEMVncweDYoizTUrtUG9pnr6jiphx6CwsbzPRSp7bssciN00vRgs4a3i");

dotenv.config();

class MainController {
  stripeCheckout = async (req, res, next) => {
    try {
      const { amount } = req.body;

      if (!amount) {
        return res.status(400).json({ error: "Amount is required" });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Kharidar",
              },
              unit_amount: amount * 100, // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: "http://maddening-bridge.surge.sh/",
        cancel_url: "http://abortive-comb.surge.sh/",
      });

      res.json({ url: session.url });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  };
}

module.exports = new MainController();
