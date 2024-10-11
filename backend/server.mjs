import express from 'express';
import cors from 'cors';



const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection string
const mongoUri = 'mongodb://localhost:27017/user_management'; 

// Connect to MongoDB
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});








const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});