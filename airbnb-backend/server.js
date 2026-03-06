const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Thêm axios để gọi API bên ngoài

const app = express();
const PORT = 5000;

// Nếu chạy trong Docker thì lấy link từ biến môi trường, nếu chạy ngoài máy tính thì vẫn dùng localhost
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://127.0.0.1:8000/predict';
// Middleware
app.use(cors());
app.use(express.json());

// Route kiểm tra server Node.js
app.get('/', (req, res) => {
    res.json({ message: "Main Backend (Node.js) đang hoạt động bình thường!" });
});

// ==========================================
// ĐÂY LÀ CẦU NỐI NODE.JS <-> PYTHON
// ==========================================
app.post('/api/predict', async (req, res) => {
    try {
        // 1. Lấy dữ liệu căn hộ do React (Frontend) gửi lên
        const roomData = req.body;

        // 2. Dùng axios gửi cục dữ liệu đó sang FastAPI
        const aiResponse = await axios.post(FASTAPI_URL, roomData);

        // 3. Nhận được giá dự đoán từ AI, trả ngược lại cho React hiển thị
        res.json(aiResponse.data);

    } catch (error) {
        // Xử lý lỗi nếu FastAPI bị sập hoặc gửi sai dữ liệu
        console.error("Lỗi khi kết nối với trạm AI Python:", error.message);
        res.status(500).json({
            status: "error",
            message: "Không thể dự đoán giá lúc này. Vui lòng thử lại sau!"
        });
    }
});

// Khởi chạy server
app.listen(PORT, () => {
    console.log(`🚀 Server Node.js đang chạy tại: http://localhost:${PORT}`);
    console.log(`🔗 API Dự đoán giá (Gateway) sẵn sàng tại: http://localhost:${PORT}/api/predict`);
});