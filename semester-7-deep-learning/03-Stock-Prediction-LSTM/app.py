import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Dropout, GRU, Bidirectional
import plotly.graph_objs as go

# --- 1. KONFIGURASI HALAMAN ---
st.set_page_config(
    page_title="Robot Prediksi Saham AI",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.title("🤖 Robot Prediksi Saham (Deep Learning)")
st.markdown("""
**Selamat Datang!** Aplikasi ini adalah implementasi Tugas 3 Algoritma Deep Learning.
Silakan upload data historis saham (CSV/Excel) untuk melatih robot memprediksi harga di masa depan.
""")


# --- 2. FUNGSI-FUNGSI UTAMA (CORE LOGIC) ---

def load_data(uploaded_file):
    """Membaca file yang diupload (support CSV dan Excel)"""
    try:
        if uploaded_file.name.endswith('.csv'):
            # Coba baca dengan delimiter ; (format umum data saham Indonesia)
            df = pd.read_csv(uploaded_file, delimiter=";")
            # Jika gagal (hanya 1 kolom), coba baca dengan koma
            if df.shape[1] < 2:
                uploaded_file.seek(0)
                df = pd.read_csv(uploaded_file, delimiter=",")
        else:
            df = pd.read_excel(uploaded_file)
        return df
    except Exception as e:
        return None

def create_dataset(dataset, time_step=60):
    """
    Mengubah data time-series menjadi format supervised learning.
    X = [harga_hari_1, ..., harga_hari_60]
    y = [harga_hari_61]
    """
    dataX, dataY = [], []
    for i in range(len(dataset) - time_step - 1):
        a = dataset[i:(i + time_step), 0]
        dataX.append(a)
        dataY.append(dataset[i + time_step, 0])
    return np.array(dataX), np.array(dataY)

def build_model(model_type, input_shape):
    """Membangun arsitektur Neural Network sesuai pilihan"""
    model = Sequential()
    
    # Layer 1
    if model_type == 'LSTM':
        model.add(LSTM(64, return_sequences=True, input_shape=input_shape))
    elif model_type == 'Bidirectional LSTM':
        model.add(Bidirectional(LSTM(64, return_sequences=True), input_shape=input_shape))
    elif model_type == 'GRU':
        model.add(GRU(64, return_sequences=True, input_shape=input_shape))
    
    model.add(Dropout(0.2))
    
    # Layer 2
    if model_type == 'LSTM':
        model.add(LSTM(64, return_sequences=False))
    elif model_type == 'Bidirectional LSTM':
        model.add(Bidirectional(LSTM(64, return_sequences=False)))
    elif model_type == 'GRU':
        model.add(GRU(64, return_sequences=False))
        
    model.add(Dropout(0.2))
    
    # Output Layer (Prediksi Harga)
    model.add(Dense(1)) 
    
    model.compile(optimizer='adam', loss='mean_squared_error')
    return model

# --- 3. SIDEBAR & INPUT USER ---

st.sidebar.header("⚙️ Panel Kontrol")

# A. Upload File
uploaded_file = st.sidebar.file_uploader("1. Upload Dataset (CSV/Excel)", type=["csv", "xlsx"])

# B. Parameter Model
st.sidebar.subheader("2. Konfigurasi AI")
model_option = st.sidebar.selectbox("Pilih Algoritma", ["LSTM", "Bidirectional LSTM", "GRU"])
time_step = st.sidebar.slider("Time Step (Jendela Waktu)", 10, 100, 60, help="Berapa hari ke belakang yang dilihat robot untuk memprediksi hari esok.")
epochs = st.sidebar.number_input("Jumlah Epochs (Training)", min_value=1, max_value=200, value=10)
batch_size = st.sidebar.number_input("Batch Size", min_value=1, max_value=128, value=32)

# --- 4. EKSEKUSI UTAMA ---

if uploaded_file is not None:
    # Load Data
    df = load_data(uploaded_file)
    
    if df is not None:
        # Tampilkan Data Mentah
        with st.expander("Lihat Data Mentah", expanded=True):
            st.dataframe(df.head())
        
        # Pilih Kolom Target Otomatis (Cari yang namanya 'Close' atau 'Terakhir')
        numeric_cols = df.select_dtypes(include=np.number).columns.tolist()
        default_idx = 0
        if 'Close' in numeric_cols: default_idx = numeric_cols.index('Close')
        elif 'Terakhir' in numeric_cols: default_idx = numeric_cols.index('Terakhir')
            
        target_col = st.sidebar.selectbox("3. Kolom Target (Harga)", numeric_cols, index=default_idx)
        
        # Visualisasi Data Awal (Plotly)
        fig_raw = go.Figure()
        fig_raw.add_trace(go.Scatter(y=df[target_col], mode='lines', name='Harga Historis', line=dict(color='blue')))
        fig_raw.update_layout(title=f"Grafik Harga Saham: {target_col}", xaxis_title="Hari", yaxis_title="Harga", height=400)
        st.plotly_chart(fig_raw, use_container_width=True)

        # Tombol Mulai Training
        if st.sidebar.button("🚀 Mulai Training & Prediksi"):
            
            # --- PREPROCESSING ---
            data = df.filter([target_col]).values
            
            # Normalisasi Data (0-1)
            scaler = MinMaxScaler(feature_range=(0, 1))
            scaled_data = scaler.fit_transform(data)
            
            # Splitting Data (80% Train, 20% Test)
            train_size = int(len(scaled_data) * 0.8)
            train_data = scaled_data[:train_size]
            test_data = scaled_data[train_size - time_step:]
            
            # Buat Sequence (X, y)
            X_train, y_train = create_dataset(train_data, time_step)
            X_test, y_test = create_dataset(test_data, time_step)
            
            # Reshape untuk input LSTM [samples, time steps, features]
            # PERBAIKAN DI SINI: x_test menjadi X_test
            X_train = np.reshape(X_train, (X_train.shape[0], X_train.shape[1], 1))
            X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))

            # --- TRAINING MODEL ---
            progress_bar = st.progress(0)
            status_text = st.empty()
            
            status_text.text(f"Sedang melatih model {model_option}...")
            
            model = build_model(model_option, (X_train.shape[1], 1))
            
            # Training
            history = model.fit(X_train, y_train, batch_size=batch_size, epochs=epochs, verbose=0)
            progress_bar.progress(100)
            status_text.success("Training Selesai!")
            
            # Tampilkan Grafik Loss (Error)
            st.subheader("📉 Performa Training (Loss)")
            fig_loss = go.Figure()
            fig_loss.add_trace(go.Scatter(y=history.history['loss'], mode='lines', name='Loss', line=dict(color='orange')))
            st.plotly_chart(fig_loss, use_container_width=True)
            
            # --- PREDIKSI ---
            predictions = model.predict(X_test)
            predictions = scaler.inverse_transform(predictions) # Kembalikan ke harga asli
            
            # Siapkan data untuk plot validasi
            valid = df[train_size:]
            # Pastikan panjang array sama (potong data validasi agar sesuai dengan hasil prediksi)
            # Karena create_dataset memotong 'time_step' data di awal
            valid = valid.iloc[len(valid) - len(predictions):].copy() 
            valid['Predictions'] = predictions

            # --- VISUALISASI HASIL ---
            st.subheader(f"📊 Hasil Prediksi vs Realita ({model_option})")
            
            fig_res = go.Figure()
            # Harga Asli
            fig_res.add_trace(go.Scatter(
                x=valid.index, y=valid[target_col], 
                mode='lines', name='Harga Asli', 
                line=dict(color='blue', width=2)
            ))
            # Harga Prediksi
            fig_res.add_trace(go.Scatter(
                x=valid.index, y=valid['Predictions'], 
                mode='lines', name='Prediksi AI', 
                line=dict(color='red', width=2, dash='dot')
            ))
            
            fig_res.update_layout(title="Perbandingan Akurasi", xaxis_title="Index Data", yaxis_title="Harga")
            st.plotly_chart(fig_res, use_container_width=True)
            
            # Tampilkan Data Tabel
            col1, col2 = st.columns(2)
            with col1:
                st.write("📋 **Data Perbandingan (10 Hari Terakhir)**")
                st.dataframe(valid.tail(10))
            
            with col2:
                # Hitung Error Sederhana (RMSE)
                rmse = np.sqrt(np.mean(((predictions - valid[target_col].values) ** 2)))
                st.info(f"**Root Mean Squared Error (RMSE):** {rmse:.2f}")
                st.write("*Semakin kecil nilai RMSE, semakin akurat prediksinya.*")

    else:
        st.error("Gagal membaca file. Pastikan formatnya CSV atau Excel yang valid.")
else:
    # Tampilan awal jika belum upload
    st.info("👈 Silakan upload dataset saham pada sidebar untuk memulai.")