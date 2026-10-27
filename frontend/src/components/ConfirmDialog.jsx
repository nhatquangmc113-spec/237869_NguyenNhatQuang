import Modal from './Modal.jsx';

export default function ConfirmDialog({ employee, deleting, onConfirm, onCancel }) {
  return (
    <Modal title="Xác nhận xóa" onClose={onCancel}>
      <p className="confirm-text">
        Bạn có chắc chắn muốn xóa hồ sơ nhân viên{' '}
        <strong>
          {employee.fullName} ({employee.employeeId})
        </strong>
        ? Thao tác này không thể hoàn tác.
      </p>
      <div className="modal-actions">
        <button type="button" className="btn" onClick={onCancel} disabled={deleting}>
          Hủy
        </button>
        <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={deleting}>
          {deleting ? 'Đang xóa...' : 'Xóa'}
        </button>
      </div>
    </Modal>
  );
}
