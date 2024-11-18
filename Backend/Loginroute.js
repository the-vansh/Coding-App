const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./Userschema');
const express = require('express');
const router = express.Router();
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // If the credentials are valid, generate a JWT token
      const token = jwt.sign({ userId: user._id }, "THE_VANSH", { expiresIn: '1h' });
  
      // Send the token in the response
      res.status(200).json({  success:1,authtoken:token });
      console.log("Login sucess");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;