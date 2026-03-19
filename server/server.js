const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ 
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  credentials: true 
})); 
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected to Atlas'))
  .catch((err) => {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1); // Exit if cannot connect
  });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/reviews', require('./routes/reviews'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));

  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  });
}

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
