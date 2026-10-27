import { formatDate, statusClass } from '../utils.js';

export default function EmployeeDetail({ employee, onEdit, onClose }) {
  const rows = [
    ['Mã nhân viên', employee.employeeId],
    ['Họ và tên', employee.fullName],
    ['Giới tính', employee.gender || '—'],
    ['Ngày sinh', formatDate(employee.dateOfBirth)],
    ['Phòng ban', employee.department || '—'],
    ['Chức vụ', employee.position || '—'],
    ['Email', employee.email],
    ['Số điện thoại', employee.phone || '—'],
    ['Ngày vào làm', formatDate(employee.hireDate)],
  ];

  return (
    <>
      <dl className="detail">
        {rows.map(([label, value]) => (
          <div className="detail-row" key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
        <div className="detail-row">
          <dt>Trạng thái</dt>
          <dd>
            <span className={statusClass(employee.status)}>{employee.status}</span>
          </dd>
        </div>
      </dl>
      <div className="modal-actions">
        <button type="button" className="btn" onClick={onClose}>
          Đóng
        </button>
        <button type="button" className="btn btn-primary" onClick={onEdit}>
          Chỉnh sửa
        </button>
      </div>
    </>
  );
}
