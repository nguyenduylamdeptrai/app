# 1. Dùng bản Node.js siêu nhẹ (alpine) làm nền tảng
FROM node:18-alpine

# 2. Tạo một thư mục tên là /app ở bên trong container để chứa code
WORKDIR /app

# 3. Copy 2 file package.json và package-lock.json vào trước
# (Mẹo tối ưu: Copy riêng cái này giúp Docker cache lại bước cài thư viện, build siêu nhanh ở lần sau)
COPY package*.json ./

# 4. Cài đặt các thư viện (express, cors, axios)
RUN npm install

# 5. Copy toàn bộ code còn lại (file server.js) vào trong /app
COPY . .

# 6. Khai báo cổng 5000 để lát nữa nối dây sang React và Python
EXPOSE 5000

# 7. Lệnh khởi động server khi cái "thùng" này được bật lên
CMD ["npm", "start"]