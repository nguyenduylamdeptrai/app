# 1. Dùng bản Python 3.9 slim (Tối ưu cho Machine Learning, nhẹ hơn bản thường nhưng an toàn hơn Alpine)
FROM python:3.9-slim

# 2. Tạo thư mục làm việc bên trong container
WORKDIR /app

# 3. Copy tờ danh sách thư viện vào trước để lợi dụng tính năng Cache (giống hệt tư duy bên Node.js)
COPY requirements.txt .

# 4. Cài đặt các thư viện AI (thêm --no-cache-dir để file Docker nhẹ hơn, không lưu rác sau khi cài)
RUN pip install --default-timeout=1000 --no-cache-dir -r requirements.txt

# 5. Copy toàn bộ code (main.py) và các file model (.pkl, .csv) vào container
COPY . .

# 6. Mở cửa cổng 8000
EXPOSE 8000

# 7. Khởi động trạm AI. 
# LƯU Ý QUAN TRỌNG: Phải dùng --host 0.0.0.0 để các container khác có thể gọi được vào đây!
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]