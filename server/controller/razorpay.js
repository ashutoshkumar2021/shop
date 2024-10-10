const Razorpay = require("razorpay");
require("dotenv").config();

// Initialize Razorpay instance
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

class razorpay {
  // Create an order (equivalent to getting token in Braintree)
  async paymentProcess(req, res) {

    const { amount, currency } = req.body;
    // Razorpay requires amount in paisa, so multiply by 100
    const payment_capture = 1; // automatic capture
    const options = {
      amount: amount * 100, // amount in paisa (e.g., ₹500 => 50000 paisa)
      currency: currency || "INR",
      payment_capture, // 1 means auto-capture, 0 means manual capture
    };

    try {
      const order = await instance.orders.create(options);
      return res.json({
        id: order.id,
        currency: order.currency,
        amount: order.amount,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error creating Razorpay order" });
    }
  }

  // Handle payment processing
  generateToken(req, res) {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    try {
      // You can verify the signature to ensure the payment is legitimate
      const crypto = require("crypto");
      const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generated_signature = hmac.digest("hex");

      if (generated_signature !== razorpay_signature) {
        return res.status(400).json({ error: "Invalid signature received" });
      }

      // If signature is valid, the payment is successful
      return res.json({
        message: "Payment successful",
        razorpay_payment_id,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error processing payment" });
    }
  }
}

const razorpayController = new razorpay();
module.exports = razorpayController;
