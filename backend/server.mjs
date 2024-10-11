import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';



const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection string
const mongoUri = 'mongodb://localhost:27017/mern-application'; 

const corsOptions = {
    origin: 'http://localhost:5173/', // Your local React frontend URL
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions)); 

// Connect to MongoDB
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

// Define User schema and model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const User = mongoose.model('User', userSchema);

// Error handler middleware
function errorHandler(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong',
    error: true,
  });
}


// GET all users
app.get('/api/users', async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json({ message: 'Get all users!', data: users });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: true });
    }
  });
  // POST a new user
app.post('/api/users', async (req, res) => {
    const { name, email } = req.body;
  
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required!' });
    }
  
    try {
      const newUser = new User({ name, email });
      await newUser.save();
      res.status(201).json({ message: 'New user created!', data: newUser });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: true });
    }
  });
  // PUT (Update) a user
app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
  
    try {
      const updatedUser = await User.findByIdAndUpdate(id, { name, email }, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found!' });
      }
      res.status(200).json({ message: 'User updated successfully!', data: updatedUser });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: true });
    }
  });
  

  // DELETE a user
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found!' });
      }
      res.status(200).json({ message: 'User deleted successfully!' });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: true });
    }
  });
  





const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});