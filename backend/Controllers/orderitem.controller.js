import { request } from "express";
import Orderitem from "../Models/orderitem.Model.js";
import moment from "moment-timezone";
import axios from "axios";


const sendTelegramMessage = async () => {
  const botToken = process.env.bot;
  const chatId = process.env.admin;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: chatId,
      text: "new order" ,
    });
    console.log('Telegram message sent.');
  } catch (error) {
    console.error('Error sending Telegram message:', error.message);
  }
};

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
    await sendTelegramMessage();
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

