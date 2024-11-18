const bcrypt = require('bcrypt');
const User = require('./Userschema');
const express = require('express');
const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
     
      const { username,email, password} = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password,10);
      const user = new User({ username, email, password: hashedPassword});
      await user.save();
      res.status(201).json({ success:'1',message: 'User created successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  module.exports = router;