const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
    quantity: { type: Number, required: true },
    totalAmount: { type: Number, required: true }
  }, {
    timestamps: true
  });

module.exports = mongoose.model('Order', orderSchema);
