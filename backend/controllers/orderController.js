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
        <h2>Hello ${order.customerName || order.firstName},</h2>
        <p>Your order has been <b>shipped</b>.</p>
        <p><b>Tracking ID:</b> ${trackingId}</p>
        <p>You can use this tracking ID to track your order status.</p>
        <br/>
        <p>Thank you for shopping with us!</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Order marked as shipped and email sent", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error });
  }
};

