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

// Endpoint kiểm tra trạng thái (dùng cho Render và kiểm tra thủ công)
app.get('/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'degraded',
    database: connected ? 'connected' : 'disconnected',
    uptime: Math.round(process.uptime()),
  });
});

app.use('/api/employees', employeeRoutes);

// Đường dẫn không tồn tại
app.use((req, res) => {
  res.status(404).json({ message: 'Không tìm thấy đường dẫn' });
});

// Xử lý lỗi chung (ví dụ JSON gửi lên bị sai cú pháp)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Dữ liệu JSON không hợp lệ' });
  }
  console.error(err);
  res.status(500).json({ message: 'Lỗi máy chủ' });
});

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
