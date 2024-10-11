import express from 'express';
import cors from 'cors';



const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection string
const mongoUri = 'mongodb://localhost:27017/UserManagement-Mern'; 

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
  





const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});