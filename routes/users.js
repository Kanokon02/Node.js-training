var express = require('express');
var router = express.Router();
const userSchema = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


router.post("/register", async function (req, res, next) {
  const { name, password } = req.body;
  // const { authorization } = req.headers;
  try {
    const newUser = await userSchema.create({
      name,
      password: await bcrypt.hash(password, 10),
    });
    res.status(201).send({
      status: "201",
      message: "Create success",
      data: newUser,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/login", async function (req, res, next) {
  try {
    const { name, password } = req.body;
    console.log(req.body)
    let user = await userSchema.findOne({name});
    if (!user){
      return res.status(400).send("ไม่พบผู้ใช้งาน กรุณาสมัครสมาชิก")
    }
    const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
        }
    if (!user.approve){
      return res.status(401).json({ message: 'ผู้ใช้ยังไม่ได้รับการยืนยัน' });
    }

    const { password: pwd, ...userWithoutPassword } = user._doc;

    let userWithIsMatch = {
      ...userWithoutPassword,
      isMatch
    };
    //let token = await jwt.sign(userWithIsMatch, process.env.KEY_TOKEN)
    // res.status(201).send({
    //   token:token
    // });
    res.status(201).send({
      status: "201",
      message: "เข้าสู่ระบบสำเร็จ"
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put("/approve/:id", async function (req, res, next) {
  const { id } = req.params;
  try {
    // อัปเดตค่าของ is_approve เป็น true
    const updatedUser = await userSchema.findByIdAndUpdate(
      id,
      { approve: true },
      { new: true } // ส่งกลับเอกสารที่ถูกอัปเดต
    );
  
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.status(201).send({
      status: "201",
      message: "ยืนยันผู้ใช้สำเร็จ",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error approving user:", error);
    res.status(500).send(error.message || "Internal Server Error");
  }
});

/*router.post('/register', async (req, res) => {
  try {
      const { name, password } = req.body;
console.log(name+password)
      // Validate input
      if (!name || !password) {
          return res.status(400).json({ status: 400, message: "ชื่อผู้ใช้และรหัสผ่านเป็นสิ่งจำเป็น" });
      }

      // Check if user already exists
      const existingUser = await userSchema.findOne({ name });
      if (existingUser) {
          return res.status(400).json({ status: 400, message: "ชื่อผู้ใช้นี้มีอยู่แล้ว" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
          name,
          password: hashedPassword
      });

      // Save the user to the database
      await newUser.save();

      res.status(201).json({ status: 201, message: "ลงทะเบียนสำเร็จ", data: newUser });
  } catch (error) {
      res.status(500).json({ status: 500, message: "ข้อผิดพลาดของเซิร์ฟเวอร์" });
  }
});
*/

module.exports = router;
