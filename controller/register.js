import User from "../database/mongo_schemar.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export default async function Register(req, res) {
    try {
      const { username, password, email } = req.body;
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        username,
        password: hashedPassword,
        email
      });
  
      await newUser.save();
  
      const token = jwt.sign({ username }, 'secretkey', { expiresIn: '1h' });
  
      res.json({ token });
    } catch (error) {
      console.log(error);
      res.status(500).send('Error registering user');
    }
  };


  