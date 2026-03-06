import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    neighbourhood_group: 'Manhattan',
    room_type: 'Entire home/apt',
    minimum_nights: 1,
    number_of_reviews: 10,
    reviews_per_month: 1.0,
    calculated_host_listings_count: 1,
    availability_365: 365,
    longitude: -73.985,
    latitude: 40.748
  });

  const [predictedPrice, setPredictedPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'neighbourhood_group' || name === 'room_type' ? value : Number(value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPredictedPrice(null);
    try {
      const response = await axios.post('http://localhost:5000/api/predict', formData);
      // Nếu AI tính ra giá âm, ta ép nó về giá tối thiểu là 10 đô. Nếu lớn hơn 10 thì giữ nguyên giá trị AI tính.
      const price = response.data.predicted_price_usd;
      setPredictedPrice(Math.max(10, price).toFixed(2));
    } catch (err) {
      alert("Lỗi kết nối đến máy chủ AI! Hãy kiểm tra xem Node.js và Python đã chạy chưa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl p-8 md:p-10">

        {/* Tiêu đề */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-airbnb mb-2">Dự đoán giá Airbnb 🗽</h1>
          <p className="text-gray-500">Ứng dụng AI ước tính giá thuê nhà tại New York</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Nhóm 1: Vị trí & Loại phòng */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">1. Vị trí & Không gian</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Khu vực (Quận)</label>
                <select name="neighbourhood_group" value={formData.neighbourhood_group} onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb focus:border-transparent outline-none transition">
                  <option value="Manhattan">Manhattan</option>
                  <option value="Brooklyn">Brooklyn</option>
                  <option value="Queens">Queens</option>
                  <option value="Bronx">Bronx</option>
                  <option value="Staten Island">Staten Island</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Loại phòng</label>
                <select name="room_type" value={formData.room_type} onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb focus:border-transparent outline-none transition">
                  <option value="Entire home/apt">Nguyên căn hộ</option>
                  <option value="Private room">Phòng riêng</option>
                  <option value="Shared room">Phòng chung</option>
                </select>
              </div>
            </div>
          </div>

          {/* Nhóm 2: Chính sách */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">2. Chính sách cho thuê</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Số đêm tối thiểu</label>
                <input type="number" name="minimum_nights" min="1" value={formData.minimum_nights} onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Ngày trống/năm</label>
                <input type="number" name="availability_365" min="0" max="365" value={formData.availability_365} onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Số lượt Review</label>
                <input type="number" name="number_of_reviews" min="0" value={formData.number_of_reviews} onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb outline-none transition" />
              </div>
            </div>
          </div>

          {/* Nút Submit */}
          <button type="submit" disabled={loading}
            className="w-full py-4 px-6 mt-4 text-white font-bold text-lg rounded-xl bg-airbnb hover:bg-rose-600 transition-all shadow-lg hover:shadow-xl disabled:bg-rose-300 disabled:cursor-not-allowed">
            {loading ? '🤖 Đang tính toán...' : 'Dự đoán giá ngay'}
          </button>

        </form>

        {/* Khối Kết quả */}
        {predictedPrice && (
          <div className="mt-8 p-8 bg-emerald-50 border-2 border-emerald-400 rounded-2xl text-center animate-[bounce_0.5s_ease-in-out]">
            <p className="text-emerald-700 font-medium mb-2">✨ Mức giá đề xuất cho căn hộ này là:</p>
            <h1 className="text-5xl font-extrabold text-emerald-600">
              ${predictedPrice} <span className="text-2xl font-normal text-emerald-500">/ đêm</span>
            </h1>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;