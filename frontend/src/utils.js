export const GENDERS = ['Nam', 'Nữ', 'Khác'];
export const STATUSES = ['Đang làm việc', 'Nghỉ phép', 'Đã nghỉ việc'];

// "1995-03-15T00:00:00.000Z" -> "1995-03-15" (dùng cho <input type="date">)
export function toInputDate(value) {
  return value ? String(value).slice(0, 10) : '';
}

// "1995-03-15T00:00:00.000Z" -> "15/03/1995"
export function formatDate(value) {
  if (!value) return '—';
  const [year, month, day] = String(value).slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

export function statusClass(status) {
  if (status === 'Đang làm việc') return 'badge badge-active';
  if (status === 'Nghỉ phép') return 'badge badge-leave';
  return 'badge badge-off';
}
