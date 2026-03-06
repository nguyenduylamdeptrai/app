# ==========================================
# BƯỚC 1: MÔI TRƯỜNG BUILD (Nhà máy)
# ==========================================
# Dùng image Node.js bản alpine (bản siêu nhẹ)
FROM node:18-alpine as build

# Cài đặt thư mục làm việc bên trong container
WORKDIR /app

# Copy 2 file package.json vào trước để cài thư viện
COPY package*.json ./
RUN npm install

# Copy toàn bộ code React của bạn vào container
COPY . .

# Chạy lệnh build để dịch React thành HTML/CSS/JS thuần
RUN npm run build

# ==========================================
# BƯỚC 2: MÔI TRƯỜNG CHẠY (Cửa hàng Nginx)
# ==========================================
# Dùng image Nginx (Web server siêu nhẹ)
FROM nginx:alpine

# Copy kết quả từ Bước 1 sang thư mục chứa web của Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Nginx mặc định chạy ở cổng 80, ta khai báo để biết đường map port
EXPOSE 80

# Lệnh khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]