// Địa chỉ Backend lấy từ biến môi trường VITE_API_URL (xem .env.example)
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch (err) {
    throw new Error('Không kết nối được tới máy chủ. Vui lòng thử lại sau.');
  }

  let data = null;
  try {
    data = await response.json();
  } catch (err) {
    // Phản hồi không phải JSON
  }

  if (!response.ok) {
    throw new Error((data && data.message) || `Yêu cầu thất bại (mã ${response.status})`);
  }
  return data;
}

export function getEmployees(search = '') {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return request(`/api/employees${query}`);
}

export function createEmployee(employee) {
  return request('/api/employees', { method: 'POST', body: JSON.stringify(employee) });
}

export function updateEmployee(id, employee) {
  return request(`/api/employees/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(employee),
  });
}

export function deleteEmployee(id) {
  return request(`/api/employees/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
