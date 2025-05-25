import { request } from "express";
import Orderitem from "../Models/orderitem.Model.js";
import moment from "moment-timezone";
import admin from '../firebase.js'; // Import Firebase Admin

export const postsaveorders = async (req, res) => {
  try {
    const { items, totalAmount, tableId, request } = req.body;
    const now = new Date();
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1, // Tomorrow
      0,
      0,
      0,
      0
    );
    if (
      (!items ||
        !totalAmount ||
        !tableId)
    ) {
      if (!request) {
        return res.status(400).json({ error: "Invalid data in saveorders." });
      }
    }
    const newOrder = new Orderitem({
      items: items,
      totalAmount: totalAmount,
      tableId: tableId,
      deleteAt: midnight,
      request: request,
    });
    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully" });
  } catch (error) {
    console.log("Error during saving order:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getgetorders = async (req, res) => {
  try {
    const alldata = await Orderitem.find();
    const formattedOrders = alldata.map((order) => ({
      ...order.toObject(), //convert mongoose document to plain objects.
      OrderDate: moment
        .utc(order.OrderDate)
        .tz("Asia/Kathmandu")
        .format("YYYY-MM-DD HH:mm:ss"),
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error("Error during fetching orders", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const postconfirm_payment = async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Orderitem.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order confirmed" });
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const patchorders = async (req, res) => {
  try {
    const order = await Orderitem.findByIdAndUpdate(
      req.params.id,
      { paid: req.body.paid },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }
    res.json(order);
  } catch (error) {
    console.error("Error updating paid status:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const postupdateId = async (req, res) => {
  try {
    const order = await Orderitem.findByIdAndUpdate(
      req.body._id,
      { tableId: req.body.tableId },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error." });
  }
}

export const placeOrder = async (req, res) => {
  try {
    const { orderDetails, adminToken } = req.body; // Ensure adminToken is sent from the frontend

    // Save order logic
    // ...existing code to save the order...

    // Send notification to admin
    const message = {
      notification: {
        title: 'New Order Placed',
        body: `Order ID: ${orderDetails.id} has been placed.`,
      },
      token: adminToken, // Admin's FCM token
    };

    await admin.messaging().send(message);

    res.status(200).json({ message: 'Order placed and notification sent!' });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
};