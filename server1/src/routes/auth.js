const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authRequired = require('../middleware/auth');

const router = express.Router();

router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, mobileNumber, password } = req.body;
    if(!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const exists = await User.findOne({ email });
    if(exists) return res.status(409).json({ error: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, name , mobileNumber});
    res.status(201).json({ id: user._id, email: user.email, name: user.name });
  } catch(e){ next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("pass",password)
    if(!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = await User.findOne({ email });
    console.log("ismatch",await bcrypt.compare(password, user.password))
    if(!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch(e){ next(e); }
});


router.get('/me', authRequired, async (req, res, next) => {
  try{
    const user = await User.findById(req.user.userId).select('-password').lean();
    console.log(user)
    if(!user) return res.status(404).json({ error: 'Not found' });
    res.json({...user} );
  }catch(e){ next(e); }
});


const hashPassword = async (plainPassword) => {
   return await bcrypt.hash(plainPassword, 10);
};

router.post('/create', async (req, res, next) => {
   try {
      const { password, ...rest } = req.body;

      // hash password
      const hashedPassword = await hashPassword(password);

      const user = await User.create({
         ...rest,
         password: hashedPassword
      });

      res.status(201).json({
         success: true,
         message: "Client Created Successfully",
         user
      });
   } catch (error) {
      console.error(error);
      return next(error);
   }
});

router.put('/update/:id', async (req, res, next) => {
   try {
      const user = await User.findByIdAndUpdate(
         req.params.id,
         req.body,
         { new: true, runValidators: true }
      );

      if (!user) {
         return next({"User not found": 404});
      }

      res.status(200).json({
         success: true,
         message: "User updated successfully",
         user
      });
   } catch (error) {
      console.error(error);
      return next(error);
   }
});

router.delete('/delete/:id', async (req, res, next) => {
   try {
      const user = await User.findByIdAndDelete(req.params.id);

      if (!user) {
         return next();
      }

      res.status(200).json({
         success: true,
         message: "User deleted successfully"
      });
   } catch (error) {
      console.error(error);
      return next(error);
   }
});

router.get('/all', async (req, res, next) => {
   try {
      const users = await User.find().select('-password -resetPasswordToken -resetPasswordExpires');

      res.status(200).json({
         success: true,
         count: users.length,
         users
      });
   } catch (error) {
      console.error(error);
      return next(new ErrorHandler("Failed to fetch users", 500));
   }
});


module.exports = router;
