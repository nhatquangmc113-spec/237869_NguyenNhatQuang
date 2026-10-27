# Hệ thống quản lý nhân sự

## Thông tin sinh viên

- Họ tên: Nguyễn Nhật Quang
- MSSV: 237869
- Lớp: DH23TIN10

## Mô tả hệ thống

Ứng dụng web quản lý hồ sơ nhân viên, cho phép:

- Xem danh sách nhân viên và thông tin chi tiết.
- Thêm mới hồ sơ nhân viên.
- Tìm kiếm nhân viên theo mã nhân viên hoặc họ tên.
- Cập nhật thông tin nhân viên.
- Xóa hồ sơ nhân viên.
- Hiển thị thông báo khi thao tác thành công hoặc thất bại.

Frontend giao tiếp với Backend qua REST API; dữ liệu lưu trên MongoDB Atlas.

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Frontend | React |
| Backend | Node.js, Express |
| Cơ sở dữ liệu | MongoDB Atlas (database `237869_NguyenNhatQuang`, collection `employees`) |
| Quản lý mã nguồn | Git, GitHub |
| Đóng gói | Docker |
| Lưu trữ image | Docker Hub |
| Triển khai | Render |

## Cấu trúc thư mục

```
237869_NguyenNhatQuang/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── README.md
└── .gitignore
```

## Cơ sở dữ liệu

- Nền tảng: MongoDB Atlas (cluster `Cluster0`)
- Database: `237869_NguyenNhatQuang`
- Collection: `employees`

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| employeeId | String | Mã nhân viên, duy nhất |
| fullName | String | Họ và tên |
| gender | String | Giới tính |
| dateOfBirth | Date | Ngày sinh |
| department | String | Phòng ban |
| position | String | Chức vụ |
| email | String | Email |
| phone | String | Số điện thoại |
| hireDate | Date | Ngày vào làm |
| status | String | Trạng thái làm việc |

Dữ liệu mẫu nằm ở `backend/seed/employees.sample.json`. Nạp vào database bằng `npm run seed` (trong thư mục `backend`, cần file `.env`).

## Hướng dẫn chạy ở môi trường phát triển

### Yêu cầu

- Node.js 18 trở lên
- Tài khoản MongoDB Atlas và chuỗi kết nối

### Backend

```bash
cd backend
cp .env.example .env     # rồi điền MONGODB_URI thật vào file .env
npm install
npm run dev
```

API chạy tại `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Giao diện chạy tại `http://localhost:5173`.

> Không commit file `.env` hoặc chuỗi kết nối MongoDB chứa mật khẩu lên GitHub.

## Liên kết

- GitHub repository: https://github.com/nhatquangmc113-spec/237869_NguyenNhatQuang
- Docker Hub Backend: https://hub.docker.com/r/nhatquang237869/backend
- Docker Hub Frontend: https://hub.docker.com/r/nhatquang237869/frontend
- Render App (web-237869): _(cập nhật sau)_
- Render API (api-237869): _(cập nhật sau)_
- MongoDB Atlas: _(cập nhật sau)_
