// Nạp dữ liệu mẫu vào collection employees.
// Chạy: npm run seed   (cần file .env có MONGODB_URI)
// Có thể chạy lại nhiều lần: bản ghi trùng employeeId sẽ được cập nhật, không bị nhân đôi.
require('dotenv').config();

const mongoose = require('mongoose');
const Employee = require('./models/Employee');
const sample = require('./seed/employees.sample.json');

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error('Thiếu biến môi trường MONGODB_URI (xem file .env.example)');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Đã kết nối MongoDB Atlas');

  const operations = sample.map((employee) => ({
    updateOne: {
      filter: { employeeId: employee.employeeId },
      update: { $set: employee },
      upsert: true,
    },
  }));
  await Employee.bulkWrite(operations);

  const total = await Employee.countDocuments();
  console.log(`Đã nạp ${sample.length} hồ sơ mẫu. Tổng số hồ sơ trong collection: ${total}`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Nạp dữ liệu thất bại:', err.message);
  process.exit(1);
});
