const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    password: String,
    admin: {type:Boolean, default:false},
    approve: {type:Boolean, default:false}
}, {
    timestamps: true
});

module.exports = mongoose.model('users', userSchema);