// controllers/orderController.js
import Order from "../models/Order.js";
import nodemailer from "nodemailer";

export const getPaidOrders = async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: "paid" });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching paid orders", error });
  }
};


export const markOrderShipped = async (req, res) => {
  const { id } = req.params;
  const { trackingId } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update order
    order.trackingId = trackingId;
    order.deliveryStatus = "shipped";
    await order.save();

    // Send email to customer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Laksh Closet" <${process.env.SMTP_EMAIL}>`,
      to: order.email,
      subject: "Your Order Has Been Shipped 🚚",
      html: `
        <body style="font-family: 'Karla', sans-serif; line-height: 1.6; color: #333; background-color: #fafafa; margin: 0; padding: 0;">
  <link href="https://fonts.googleapis.com/css2?family=Karla&display=swap" rel="stylesheet">
  
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 25px rgba(0, 0, 0, 0.05);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #CDB4DB, #FFC8DD); color: #fff; padding: 20px; text-align: center;">
      <img src="https://res.cloudinary.com/dqur1pzx4/image/upload/v1751192795/logo_k7eod4.png" alt="Laksh Closet Logo" style="height: 70px; width: auto; margin-bottom: 10px;">
      <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Laksh Closet</h1>
      <p style="margin: 0; font-size: 14px;">Elevate Your Everyday Style</p>
    </div>

    <!-- Main Content -->
    <div style="padding: 30px;">
      <h2 style="color: #444; margin-top: 0;">Hello ${order.customerName || order.firstName},</h2>
      <p>Your order has been <strong>shipped</strong>! 🚚</p>
      <p>We’re excited to let you know that your package is on its way.</p>

      <!-- Tracking Info -->
      <div style="background-color: #f5f5f5; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
        <h3 style="margin: 0; font-size: 18px; color: #555;">Tracking ID</h3>
        <h1 style="margin: 5px 0 0 0; font-size: 32px; color: #C06C84;">${trackingId}</h1>
      </div>

      <p>You can use this tracking ID to check your order status anytime.</p>
      <p>Thank you for shopping with <strong>Laksh Closet</strong>. We can’t wait for you to enjoy your purchase!</p>
      
      <p>Stay stylish,<br><strong>Team Laksh Closet</strong></p>
    </div>

    <!-- Footer -->
    <div style="background-color:rgb(186, 220, 250); color: #333; text-align: center; padding: 20px; font-size: 14px;">
      <p><strong>Laksh Closet</strong><br>Timeless fashion, doorstep delivery.</p>
    </div>

  </div>
</body>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Order marked as shipped and email sent", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error });
  }
};

