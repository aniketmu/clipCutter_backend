const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
import User from "../database/mongo_schemar"

async function Login(req, res) {
    try {
      const { username, password, } = req.body;
  
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(400).send('User not found');
      }
  
      const isValidPassword = await bcrypt.compare(password, user.password);
  
      if (!isValidPassword) {
        return res.status(400).send('Invalid password');
      }
  
      const token = jwt.sign({ username }, 'secretkey', { expiresIn: '1h' });
  
      res.json({ token });
    } catch (error) {
      console.log(error);
      res.status(500).send('Error logging in user');
    }
  };

  export default Login;