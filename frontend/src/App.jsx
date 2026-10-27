import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from './api.js';
import { statusClass } from './utils.js';
import Modal from './components/Modal.jsx';
import ConfirmDialog from './components/ConfirmDialog.jsx';
import EmployeeDetail from './components/EmployeeDetail.jsx';
import EmployeeForm from './components/EmployeeForm.jsx';

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  // modal: null | { mode: 'create' } | { mode: 'view' | 'edit', employee }
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState(null);
  const requestId = useRef(0);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Chờ người dùng ngừng gõ 400ms rồi mới tìm kiếm
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadEmployees = useCallback(async () => {
    const current = ++requestId.current;
    setLoading(true);
    setLoadError('');
    try {
      const data = await getEmployees(search);
      if (current === requestId.current) setEmployees(data);
    } catch (err) {
      if (current === requestId.current) setLoadError(err.message);
    } finally {
      if (current === requestId.current) setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  function closeModal() {
    setModal(null);
    setFormError('');
  }

  async function handleSave(values) {
    setSaving(true);
    setFormError('');
    const payload = {
      ...values,
      dateOfBirth: values.dateOfBirth || null,
      hireDate: values.hireDate || null,
    };
    try {
      if (modal.mode === 'edit') {
        await updateEmployee(modal.employee._id, payload);
        showToast('success', 'Cập nhật nhân viên thành công');
      } else {
        await createEmployee(payload);
        showToast('success', 'Thêm nhân viên thành công');
      }
      closeModal();
      await loadEmployees();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmDelete() {
    setDeleting(true);
    try {
      await deleteEmployee(toDelete._id);
      showToast('success', 'Đã xóa nhân viên');
      setToDelete(null);
      await loadEmployees();
    } catch (err) {
      showToast('error', err.message);
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="container">
      <header className="page-header">
        <div>
          <h1>Quản lý nhân sự</h1>
          <p className="subtitle">237869 – Nguyễn Nhật Quang</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setModal({ mode: 'create' })}>
          + Thêm nhân viên
        </button>
      </header>

      <div className="toolbar">
        <input
          type="search"
          className="search"
          placeholder="Tìm theo mã nhân viên hoặc họ tên..."
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          aria-label="Tìm kiếm nhân viên"
        />
        <span className="count">{loading ? '' : `${employees.length} nhân viên`}</span>
      </div>

      {loadError && (
        <div className="alert alert-error" role="alert">
          <span>{loadError}</span>
          <button type="button" className="btn btn-small" onClick={loadEmployees}>
            Thử lại
          </button>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Mã NV</th>
              <th>Họ tên</th>
              <th>Phòng ban</th>
              <th>Chức vụ</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
              <th className="actions-col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="8" className="table-message">
                  Đang tải dữ liệu...
                </td>
              </tr>
            )}
            {!loading && !loadError && employees.length === 0 && (
              <tr>
                <td colSpan="8" className="table-message">
                  {search ? 'Không tìm thấy nhân viên phù hợp' : 'Chưa có nhân viên nào'}
                </td>
              </tr>
            )}
            {!loading &&
              employees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee.employeeId}</td>
                  <td>{employee.fullName}</td>
                  <td>{employee.department || '—'}</td>
                  <td>{employee.position || '—'}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phone || '—'}</td>
                  <td>
                    <span className={statusClass(employee.status)}>{employee.status}</span>
                  </td>
                  <td className="actions-col">
                    <button type="button" className="btn btn-small" onClick={() => setModal({ mode: 'view', employee })}>
                      Xem
                    </button>
                    <button type="button" className="btn btn-small" onClick={() => setModal({ mode: 'edit', employee })}>
                      Sửa
                    </button>
                    <button type="button" className="btn btn-small btn-danger" onClick={() => setToDelete(employee)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {modal && modal.mode === 'view' && (
        <Modal title="Thông tin nhân viên" onClose={closeModal}>
          <EmployeeDetail
            employee={modal.employee}
            onClose={closeModal}
            onEdit={() => setModal({ mode: 'edit', employee: modal.employee })}
          />
        </Modal>
      )}

      {modal && (modal.mode === 'create' || modal.mode === 'edit') && (
        <Modal title={modal.mode === 'edit' ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'} onClose={closeModal}>
          <EmployeeForm
            employee={modal.mode === 'edit' ? modal.employee : null}
            saving={saving}
            serverError={formError}
            onSubmit={handleSave}
            onCancel={closeModal}
          />
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog
          employee={toDelete}
          deleting={deleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}

      {toast && (
        <div className={`toast toast-${toast.type}`} role="status">
          {toast.message}
        </div>
      )}
    </div>
  );
}
