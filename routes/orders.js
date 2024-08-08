const express = require('express');
const Order = require('../models/order'); // Adjust path as needed
const Product = require('../models/product'); // For validating product details
// const product = require('../models/product');
const router = express.Router();

// Create Order for a Specific Product
router.post('/products/:id/orders', async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        // Validate input
        if (quantity == null || quantity <= 0) {
            return res.status(400).json({ status: 400, message: "จำนวนผลิตภัณฑ์ไม่ถูกต้อง" });
        }

        // Find the product
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ status: 404, message: "ไม่พบผลิตภัณฑ์ที่ระบุ" });
        }

        // Check if the product has enough inventory
        if (product.inventory < quantity) {
            return res.status(400).json({ status: 400, message: "จำนวนผลิตภัณฑ์ไม่เพียงพอ" });
        }

        // Calculate the total amount
        const totalAmount = quantity * product.price;

        // Create a new order
        const newOrder = new Order({
            product: id,
            quantity,
            totalAmount
        });

        // Save the order to the database
        await newOrder.save();

        // Update product inventory
        await Product.findByIdAndUpdate(id, {
            $inc: { inventory: -quantity }
        });

        res.status(201).json({ status: 201, message: "สร้างคำสั่งซื้อสำเร็จ", data: newOrder });
    } catch (error) {
        res.status(500).json({ status: 500, message: "ข้อผิดพลาดของเซิร์ฟเวอร์" });
    }
});

// Get All Orders for a Specific Product
/* router.get('/products/:id/orders', async (req, res) => {
    try {
        const { id } = req.params;

        // Find orders related to the product
        const orders = await Order.find({ product: id })
            .populate('product'); // Optionally populate product details

        if (orders.length === 0) {
            return res.status(404).json({ status: 404, message: "ไม่พบคำสั่งซื้อสำหรับผลิตภัณฑ์นี้" });
        }

        res.status(200).json({ status: 200, message: "ดึงคำสั่งซื้อทั้งหมดสำเร็จ", data: orders });
    } catch (error) {
        res.status(500).json({ status: 500, message: "ข้อผิดพลาดของเซิร์ฟเวอร์" });
    }
});
*/

router.get("/products/:id/orders", async function (req, res) {
    const { id } = req.params; // ดึงค่า product ID จาก URL parameters
  
    try {
      // ตรวจสอบว่ามีผลิตภัณฑ์อยู่ในฐานข้อมูลหรือไม่
      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
        return res.status(404).send("Product not found.");
      }
  
       // ดึงคำสั่งซื้อทั้งหมดที่เชื่อมโยงกับผลิตภัณฑ์ที่ระบุ
      // const orders = await orderSchema.find({ product: id }).populate('product');

       // ดึงคำสั่งซื้อทั้งหมดที่เชื่อมโยงกับผลิตภัณฑ์ที่ระบุ
    const orders = await Order.find({ product: id })
    .select(' quantity totalAmount createdAt') // เลือกเฉพาะฟิลด์ที่ต้องการแสดง
    // .populate('product', 'name'); // populate เฉพาะฟิลด์ name ของ product
  
      // ตรวจสอบว่ามีคำสั่งซื้อหรือไม่
      if (orders.length === 0) {
        return res.status(200).send("No orders found for this product.");
      }
      
      // res.send(orders);
      res.status(200).send({
        status: "200",
        message: "คำสั่งซื้อทั้งหมดของสินค้า"+existingProduct.name,
        data: orders,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).send(error.message || "Internal Server Error");
    }
  });

  router.get("/orders", async function (req, res) {
    try {
      const orders = await Order.find();
      // res.send(orders);
      res.status(200).send({
        status: "200",
        message: "คำสั่งซื้อทั้งหมด",
        data: orders,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).send(error.message || "Internal Server Error");
    }
  });



module.exports = router;
