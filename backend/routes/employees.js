const express = require('express');
const Employee = require('../models/Employee');

const router = express.Router();

const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

// :id có thể là _id của MongoDB (24 ký tự hex) hoặc mã nhân viên (employeeId)
function filterFor(id) {
  return OBJECT_ID_PATTERN.test(id) ? { _id: id } : { employeeId: id };
}

// Loại bỏ các trường hệ thống mà client không được phép sửa
function cleanBody(body) {
  const { _id, __v, createdAt, updatedAt, ...data } = body || {};
  return data;
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Chuyển lỗi của Mongoose/MongoDB thành phản hồi JSON kèm mã HTTP phù hợp
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
    return res.status(400).json({ message: 'Dữ liệu hoặc ID không hợp lệ' });
  }
  console.error(err);
  return res.status(500).json({ message: 'Lỗi máy chủ' });
}

const NOT_FOUND = { message: 'Không tìm thấy nhân viên' };

// GET /api/employees?search=...  -> danh sách, tìm theo mã nhân viên hoặc họ tên
router.get('/', async (req, res) => {
  try {
    const search = String(req.query.search || '').trim();
    const filter = {};
    if (search) {
      const regex = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ employeeId: regex }, { fullName: regex }];
    }
    const employees = await Employee.find(filter).sort({ employeeId: 1 });
    res.json(employees);
  } catch (err) {
    handleError(res, err);
  }
});

// GET /api/employees/:id -> một nhân viên (theo _id hoặc mã nhân viên)
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findOne(filterFor(req.params.id));
    if (!employee) return res.status(404).json(NOT_FOUND);
    res.json(employee);
  } catch (err) {
    handleError(res, err);
  }
});

// POST /api/employees -> thêm mới
router.post('/', async (req, res) => {
  try {
    const employee = await Employee.create(cleanBody(req.body));
    res.status(201).json(employee);
  } catch (err) {
    handleError(res, err);
  }
});

// PUT /api/employees/:id -> cập nhật
router.put('/:id', async (req, res) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      filterFor(req.params.id),
      cleanBody(req.body),
      { new: true, runValidators: true }
    );
    if (!employee) return res.status(404).json(NOT_FOUND);
    res.json(employee);
  } catch (err) {
    handleError(res, err);
  }
});

// DELETE /api/employees/:id -> xóa
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findOneAndDelete(filterFor(req.params.id));
    if (!employee) return res.status(404).json(NOT_FOUND);
    res.json({ message: 'Đã xóa nhân viên' });
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
