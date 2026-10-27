import { useState } from 'react';
import { GENDERS, STATUSES, toInputDate } from '../utils.js';

const EMPTY = {
  employeeId: '',
  fullName: '',
  gender: 'Nam',
  dateOfBirth: '',
  department: '',
  position: '',
  email: '',
  phone: '',
  hireDate: '',
  status: 'Đang làm việc',
};

function buildInitialValues(employee) {
  if (!employee) return { ...EMPTY };
  const values = { ...EMPTY };
  Object.keys(EMPTY).forEach((key) => {
    if (employee[key] !== undefined && employee[key] !== null) values[key] = employee[key];
  });
  values.dateOfBirth = toInputDate(employee.dateOfBirth);
  values.hireDate = toInputDate(employee.hireDate);
  return values;
}

function validate(values) {
  const errors = {};
  if (!values.employeeId.trim()) errors.employeeId = 'Vui lòng nhập mã nhân viên';
  if (!values.fullName.trim()) errors.fullName = 'Vui lòng nhập họ tên';
  if (!values.email.trim()) {
    errors.email = 'Vui lòng nhập email';
  } else if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = 'Email không hợp lệ';
  }
  if (values.phone.trim() && !/^[0-9+\s().-]{8,15}$/.test(values.phone.trim())) {
    errors.phone = 'Số điện thoại không hợp lệ';
  }
  return errors;
}

function Field({ label, error, required, children }) {
  return (
    <label className="field">
      <span className="field-label">
        {label}
        {required && <span className="required"> *</span>}
      </span>
      {children}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}

export default function EmployeeForm({ employee, saving, serverError, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => buildInitialValues(employee));
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {serverError && (
        <div className="alert alert-error" role="alert">
          {serverError}
        </div>
      )}

      <div className="form-grid">
        <Field label="Mã nhân viên" required error={errors.employeeId}>
          <input name="employeeId" value={values.employeeId} onChange={handleChange} placeholder="VD: NV005" />
        </Field>
        <Field label="Họ và tên" required error={errors.fullName}>
          <input name="fullName" value={values.fullName} onChange={handleChange} placeholder="VD: Nguyễn Văn An" />
        </Field>
        <Field label="Giới tính">
          <select name="gender" value={values.gender} onChange={handleChange}>
            {GENDERS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Ngày sinh">
          <input type="date" name="dateOfBirth" value={values.dateOfBirth} onChange={handleChange} />
        </Field>
        <Field label="Phòng ban">
          <input name="department" value={values.department} onChange={handleChange} />
        </Field>
        <Field label="Chức vụ">
          <input name="position" value={values.position} onChange={handleChange} />
        </Field>
        <Field label="Email" required error={errors.email}>
          <input type="email" name="email" value={values.email} onChange={handleChange} placeholder="ten@congty.com" />
        </Field>
        <Field label="Số điện thoại" error={errors.phone}>
          <input name="phone" value={values.phone} onChange={handleChange} />
        </Field>
        <Field label="Ngày vào làm">
          <input type="date" name="hireDate" value={values.hireDate} onChange={handleChange} />
        </Field>
        <Field label="Trạng thái làm việc">
          <select name="status" value={values.status} onChange={handleChange}>
            {STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="modal-actions">
        <button type="button" className="btn" onClick={onCancel} disabled={saving}>
          Hủy
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Đang lưu...' : employee ? 'Cập nhật' : 'Thêm nhân viên'}
        </button>
      </div>
    </form>
  );
}
