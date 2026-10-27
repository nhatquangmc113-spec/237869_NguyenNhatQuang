require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const employeeRoutes = require('./routes/employees');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'HR API - 237869_NguyenNhatQuang đang chạy' });
});

app.use('/api/employees', employeeRoutes);

if (!process.env.MONGODB_URI) {
  console.error('Thiếu biến môi trường MONGODB_URI (xem file .env.example)');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Đã kết nối MongoDB Atlas');
    app.listen(PORT, () => console.log(`Server chạy tại cổng ${PORT}`));
  })
  .catch((err) => {
    console.error('Kết nối MongoDB thất bại:', err.message);
    process.exit(1);
  });
