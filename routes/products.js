const express = require('express');
const Product = require('../models/product'); // Adjust path as needed
const router = express.Router();

// Create Product
router.post('/products', async (req, res) => {
    try {
        const { name, description, price, inventory } = req.body;

        // Validate input
        if (!name || !description || price == null || inventory == null) {
            return res.status(400).json({ status: 400, message: "ข้อมูลผลิตภัณฑ์ไม่ครบถ้วน" });
        }

        // Create a new product
        const newProduct = new Product({
            name,
            description,
            price,
            inventory
        });

        // Save the product to the database
        await newProduct.save();

        res.status(201).json({ status: 201, message: "สร้างผลิตภัณฑ์สำเร็จ", data: newProduct });
    } catch (error) {
        res.status(500).json({ status: 500, message: "ข้อผิดพลาดของเซิร์ฟเวอร์" });
    }
});

// Update Product
router.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, inventory } = req.body;

        // Find and update the product
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, description, price, inventory },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ status: 404, message: "ไม่พบผลิตภัณฑ์ที่ระบุ" });
        }

        res.status(200).json({ status: 200, message: "อัปเดตผลิตภัณฑ์สำเร็จ", data: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: 500, message: "ข้อผิดพลาดของเซิร์ฟเวอร์" });
    }
});

// Delete Product
router.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the product
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ status: 404, message: "ไม่พบผลิตภัณฑ์ที่ระบุ" });
        }

        res.status(200).json({ status: 200, message: "ลบผลิตภัณฑ์สำเร็จ" });
    } catch (error) {
        res.status(500).json({ status: 500, message: "ข้อผิดพลาดของเซิร์ฟเวอร์" });
    }
});

// Get All Products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ status: 200, message: "ดึงรายการผลิตภัณฑ์ทั้งหมดสำเร็จ", data: products });
    } catch (error) {
        res.status(500).json({ status: 500, message: "ข้อผิดพลาดของเซิร์ฟเวอร์" });
    }
});

// Get Product by ID
router.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ status: 404, message: "ไม่พบผลิตภัณฑ์ที่ระบุ" });
        }

        res.status(200).json({ status: 200, message: "ดึงข้อมูลผลิตภัณฑ์สำเร็จ", data: product });
    } catch (error) {
        res.status(500).json({ status: 500, message: "ข้อผิดพลาดของเซิร์ฟเวอร์" });
    }
});

module.exports = router;
