from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI(title="Airbnb Price Prediction API")

# ==========================================
# 1. LOAD MÔ HÌNH VÀ SCALER (Chạy 1 lần khi server bật)
# ==========================================
model = joblib.load('airbnb_model.pkl')
scaler = joblib.load('airbnb_scaler.pkl')

# Lấy danh sách các cột chuẩn mà mô hình đã học từ Tuần 2
model_columns = model.feature_names_in_

# ==========================================
# 2. ĐỊNH NGHĨA SCHEMA JSON ĐẦU VÀO
# ==========================================
class AirbnbData(BaseModel):
    neighbourhood_group: str  # VD: "Manhattan", "Brooklyn"
    room_type: str            # VD: "Private room", "Entire home/apt"
    minimum_nights: int       # VD: 2
    number_of_reviews: int    # VD: 50
    reviews_per_month: float  # VD: 1.5
    calculated_host_listings_count: int # VD: 1
    availability_365: int     # VD: 200
    longitude: float          # VD: -73.985
    latitude: float           # VD: 40.748


# ==========================================
# 3. API ENDPOINT NHẬN DỮ LIỆU VÀ DỰ ĐOÁN
# ==========================================
@app.post("/predict")
def predict_price(data: AirbnbData):
    # Biến JSON đầu vào thành Dictionary, rồi ép vào một DataFrame (1 dòng)
    input_dict = data.dict()
    df = pd.DataFrame([input_dict])

    # -- TIỀN XỬ LÝ (Giống hệt Tuần 2) --
    categorical_cols = ['neighbourhood_group', 'room_type']
    numerical_cols = ['minimum_nights', 'number_of_reviews', 'reviews_per_month', 
                      'calculated_host_listings_count', 'availability_365', 'longitude', 'latitude']

    # 1. Chuẩn hóa dữ liệu số (Scaling)
    df[numerical_cols] = scaler.transform(df[numerical_cols])

    # 2. Chuyển đổi dữ liệu chữ (One-Hot Encoding)
    df_encoded = pd.get_dummies(df, columns=categorical_cols)

    # 3. Kỹ thuật ĐỒNG BỘ CỘT (Pro-tip khi deploy AI)
    # Vì người dùng chỉ nhập 1 quận (VD: Manhattan), df_encoded sẽ bị thiếu các cột của quận khác.
    # Ta phải thêm các cột thiếu đó vào và gán giá trị bằng 0 để khớp với mô hình gốc.
    for col in model_columns:
        if col not in df_encoded.columns:
            df_encoded[col] = 0
            
    # Sắp xếp lại thứ tự cột cho khớp 100% với lúc huấn luyện
    df_final = df_encoded[model_columns]

    # -- DỰ ĐOÁN --
    prediction = model.predict(df_final)

    # Trả về kết quả JSON cho Frontend
    return {
        "status": "success",
        "input_room_type": data.room_type,
        "predicted_price_usd": round(float(prediction[0]), 2) # Làm tròn 2 chữ số thập phân
    }