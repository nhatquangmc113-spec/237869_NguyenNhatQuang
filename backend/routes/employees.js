const express = require('express');
const Employee = require('../models/Employee');

const router = express.Router();

// Chuyển lỗi của Mongoose/MongoDB thành phản hồi dễ hiểu
function handleError(res, err) {
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Mã nhân viên đã tồn tại' });
  }
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    return res.status(400).json({ message });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }
  console.error(err);
  return res.status(500).json({ message: 'Lỗi máy chủ' });
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// GET /api/employees?search=...  -> danh sách, có thể tìm theo mã hoặc họ tên
router.get('/', async (req, res) => {
  try {
    const search = (req.query.search || '').trim();
    const filter = {};
    if (search) {
      const regex = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ employeeId: regex }, { fullName: regex }];
    }
    const employees = await Employee.find(filter).sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    handleError(res, err);
  }
});

// GET /api/employees/:id -> xem một nhân viên
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }
    res.json(employee);
  } catch (err) {
    handleError(res, err);
  }
});

// POST /api/employees -> thêm mới
router.post('/', async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (err) {
    handleError(res, err);
  }
});

// PUT /api/employees/:id -> cập nhật
router.put('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!employee) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }
    res.json(employee);
  } catch (err) {
    handleError(res, err);
  }
});

// DELETE /api/employees/:id -> xóa
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }
    res.json({ message: 'Đã xóa nhân viên' });
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
