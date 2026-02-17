import streamlit as st
import pandas as pd
import numpy as np
import os
from PIL import Image
import cv2
import matplotlib.pyplot as plt

# Import library khusus per tugas (Pastikan sudah pip install)
try:
    from streamlit_drawable_canvas import st_canvas
    from ultralytics import YOLO
    import tensorflow as tf
    from sklearn.preprocessing import MinMaxScaler
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import Dense, LSTM, Dropout, GRU, Bidirectional
    import plotly.graph_objs as go
except ImportError as e:
    st.error(f"Library belum lengkap. Mohon install: {e}")
    st.stop()

# --- KONFIGURASI HALAMAN ---
st.set_page_config(page_title="Portal Tugas Deep Learning", layout="wide")

# --- CSS CUSTOM (HEADER BIRU & STYLE) ---
st.markdown("""
<style>
    .header-box {
        background-color: #4472C4;
        padding: 20px;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin-bottom: 20px;
    }
    .stButton>button {
        width: 100%;
    }
</style>
""", unsafe_allow_html=True)

# --- HEADER BIODATA (SESUAI REQUEST) ---
st.markdown("""
<div class="header-box">
    <h2>Tugas Mata Kuliah Deep Learning</h2>
    <p style="font-size: 18px;">
    <b>Nama:</b> [NAMA ANDA]<br>
    <b>NPM:</b> [NPM ANDA]<br>
    <b>Kelas:</b> [KELAS ANDA]
    </p>
</div>
""", unsafe_allow_html=True)

# --- SIDEBAR NAVIGASI ---
with st.sidebar:
    st.title("Daftar Tugas:")
    selected_task = st.radio(
        "Pilih Tugas:",
        [
            "1. Calculator Operator Logika", 
            "2. Prediksi Kata dengan Bidirectional", 
            "3. Prediksi Harga Saham", 
            "4. Mengenal Object (CNN & YOLO)"
        ]
    )
    st.info("Pilih salah satu tugas untuk menampilkan hasilnya di sebelah kanan.")

# ==============================================================================
# TUGAS 1: CALCULATOR OPERATOR LOGIKA
# ==============================================================================
if selected_task == "1. Calculator Operator Logika":
    st.header("1. Calculator Operator Logika")
    st.write("Simulasi gerbang logika dasar beserta tabel kebenarannya.")
    st.markdown("---")

    col_input, col_table = st.columns([1, 1])

    with col_input:
        st.subheader("Input & Operasi")
        # Input menggunakan Selectbox agar rapi
        input_a = st.selectbox("Input A (0/1)", [0, 1])
        input_b = st.selectbox("Input B (0/1)", [0, 1])
        operasi = st.selectbox("Pilih Operasi", ["AND", "OR", "XOR", "NAND", "NOR", "XNOR"])
        
        if st.button("Hitung Logika", type="primary"):
            hasil = None
            if operasi == "AND": hasil = input_a & input_b
            elif operasi == "OR": hasil = input_a | input_b
            elif operasi == "XOR": hasil = input_a ^ input_b
            elif operasi == "NAND": hasil = int(not(input_a & input_b))
            elif operasi == "NOR": hasil = int(not(input_a | input_b))
            elif operasi == "XNOR": hasil = int(not(input_a ^ input_b))
            
            st.success(f"**Hasil {input_a} {operasi} {input_b} = {hasil}**")

    with col_table:
        st.subheader(f"Tabel Kebenaran ({operasi})")
        # Generate Tabel Kebenaran Dinamis
        df_truth = pd.DataFrame([[0,0], [0,1], [1,0], [1,1]], columns=['A', 'B'])
        
        if operasi == "AND": df_truth['Result'] = df_truth['A'] & df_truth['B']
        elif operasi == "OR": df_truth['Result'] = df_truth['A'] | df_truth['B']
        elif operasi == "XOR": df_truth['Result'] = df_truth['A'] ^ df_truth['B']
        elif operasi == "NAND": df_truth['Result'] = [int(not x) for x in (df_truth['A'] & df_truth['B'])]
        elif operasi == "NOR": df_truth['Result'] = [int(not x) for x in (df_truth['A'] | df_truth['B'])]
        elif operasi == "XNOR": df_truth['Result'] = [int(not x) for x in (df_truth['A'] ^ df_truth['B'])]
        
        # Highlight baris yang sesuai input user
        def highlight_row(row):
            if row['A'] == input_a and row['B'] == input_b:
                return ['background-color: #ffffb3'] * len(row)
            return [''] * len(row)

        st.dataframe(df_truth.style.apply(highlight_row, axis=1), use_container_width=True)

# ==============================================================================
# TUGAS 2: PREDIKSI KATA (Placeholder/Simple Demo)
# ==============================================================================
elif selected_task == "2. Prediksi Kata dengan Bidirectional":
    st.header("2. Prediksi Kata (Bidirectional RNN)")
    st.warning("⚠️ Fitur ini membutuhkan model RNN yang sudah dilatih (dari folder 02). Ini adalah simulasi antarmuka.")
    
    col1, col2 = st.columns(2)
    with col1:
        text_input = st.text_area("Masukkan Teks Awal (Corpus):", "Saya ingin belajar deep learning di kampus")
        model_type = st.selectbox("Arsitektur Model:", ["Bidirectional LSTM", "Vanilla RNN", "GRU"])
        
    with col2:
        seed_text = st.text_input("Kata Pemicu (Seed):", "Saya")
        n_words = st.slider("Jumlah Kata Prediksi:", 1, 20, 5)
        
        if st.button("Generate Teks"):
            # Simulasi output (karena meload model RNN Tensorflow di portal bisa berat/konflik path)
            st.success(f"**Output ({model_type}):**")
            st.write(f"{seed_text} ingin belajar deep learning dengan sangat cepat...")
            st.info("*Catatan: Untuk hasil real-time, jalankan app.py di folder 02 secara terpisah.*")

# ==============================================================================
# TUGAS 3: PREDIKSI SAHAM (FIX ERROR)
# ==============================================================================
elif selected_task == "3. Prediksi Harga Saham":
    st.header("3. Prediksi Harga Saham")
    st.markdown("---")

    # --- FUNGSI HELPER TUGAS 3 ---
    def create_dataset(dataset, time_step=1):
        dataX, dataY = [], []
        for i in range(len(dataset) - time_step - 1):
            a = dataset[i:(i + time_step), 0]
            dataX.append(a)
            dataY.append(dataset[i + time_step, 0])
        return np.array(dataX), np.array(dataY)

    def build_model_stock(model_type, input_shape):
        model = Sequential()
        if model_type == 'LSTM':
            model.add(LSTM(50, return_sequences=True, input_shape=input_shape))
            model.add(LSTM(50))
        elif model_type == 'Bidirectional LSTM':
            model.add(Bidirectional(LSTM(50, return_sequences=True), input_shape=input_shape))
            model.add(Bidirectional(LSTM(50)))
        elif model_type == 'GRU':
            model.add(GRU(50, return_sequences=True, input_shape=input_shape))
            model.add(GRU(50))
        model.add(Dropout(0.2))
        model.add(Dense(1))
        model.compile(optimizer='adam', loss='mean_squared_error')
        return model

    # UI TUGAS 3
    col_conf, col_main = st.columns([1, 2])

    with col_conf:
        st.subheader("Konfigurasi")
        # 1. Pilihan Algoritma (Sekarang selalu muncul)
        model_option = st.selectbox("Pilih Algoritma", ["LSTM", "Bidirectional LSTM", "GRU"])
        
        # 2. Upload File
        uploaded_file = st.file_uploader("Upload CSV Saham", type=["csv"])
        
        epochs = st.number_input("Epochs", 1, 50, 5)
        time_step = st.slider("Time Step", 10, 60, 30)

    with col_main:
        if uploaded_file is not None:
            try:
                # --- FIX ERROR PANDAS EMPTY DATA ---
                # Baca dulu dengan delimiter ';'
                df = pd.read_csv(uploaded_file, delimiter=";")
                
                # Jika kolomnya cuma 1 (artinya salah delimiter), reset pointer dan baca ulang dengan ','
                if df.shape[1] < 2:
                    uploaded_file.seek(0)  # <--- INI KUNCI PERBAIKANNYA
                    df = pd.read_csv(uploaded_file, delimiter=",")
                
                st.write("Preview Data:", df.head())
                
                # Cari kolom numerik untuk target
                numeric_cols = df.select_dtypes(include=np.number).columns.tolist()
                target_col = st.selectbox("Pilih Kolom Target", numeric_cols, index=0 if numeric_cols else None)

                if target_col and st.button("Mulai Training"):
                    with st.spinner(f"Melatih model {model_option}..."):
                        # Preprocessing
                        data = df.filter([target_col]).values
                        scaler = MinMaxScaler(feature_range=(0, 1))
                        scaled_data = scaler.fit_transform(data)
                        
                        train_size = int(len(scaled_data) * 0.8)
                        train_data = scaled_data[:train_size]
                        test_data = scaled_data[train_size - time_step:]
                        
                        X_train, y_train = create_dataset(train_data, time_step)
                        X_test, y_test = create_dataset(test_data, time_step)
                        
                        X_train = X_train.reshape(X_train.shape[0], X_train.shape[1], 1)
                        X_test = X_test.reshape(X_test.shape[0], X_test.shape[1], 1)
                        
                        # Training
                        model = build_model_stock(model_option, (X_train.shape[1], 1))
                        history = model.fit(X_train, y_train, epochs=epochs, batch_size=32, verbose=0)
                        
                        # Prediksi
                        predictions = model.predict(X_test)
                        predictions = scaler.inverse_transform(predictions)
                        
                        # Plot
                        valid = df[train_size:].copy()
                        # Potong validasi agar panjangnya sama dengan prediksi
                        valid = valid.iloc[len(valid) - len(predictions):]
                        valid['Predictions'] = predictions
                        
                        fig = go.Figure()
                        fig.add_trace(go.Scatter(x=valid.index, y=valid[target_col], mode='lines', name='Asli'))
                        fig.add_trace(go.Scatter(x=valid.index, y=valid['Predictions'], mode='lines', name='Prediksi'))
                        st.plotly_chart(fig, use_container_width=True)
                        st.success("Selesai!")

            except Exception as e:
                st.error(f"Error membaca file: {e}")
        else:
            st.info("Silakan upload file CSV di sebelah kiri.")

# ==============================================================================
# TUGAS 4: MENGENAL OBJECT (CNN & YOLO)
# ==============================================================================
elif selected_task == "4. Mengenal Object (CNN & YOLO)":
    st.header("4. Pengenalan Objek")
    st.markdown("---")
    
    mode_t4 = st.radio("Pilih Mode:", ["CNN (Angka 0-9)", "YOLO (Deteksi Objek)"], horizontal=True)
    
    # --- HELPER CNN ---
    def create_cnn_model():
        model = Sequential([
            tf.keras.layers.Conv2D(32, (3,3), activation='relu', input_shape=(28,28,1)),
            tf.keras.layers.MaxPooling2D(2,2),
            tf.keras.layers.Flatten(),
            tf.keras.layers.Dense(128, activation='relu'),
            tf.keras.layers.Dense(10, activation='softmax')
        ])
        model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
        return model

    # Path model relatif terhadap root folder
    cnn_path = os.path.join("04-Object-Detection", "model_mnist.h5")
    
    if mode_t4 == "CNN (Angka 0-9)":
        col1, col2 = st.columns(2)
        with col1:
            st.write("**Gambar Angka:**")
            canvas = st_canvas(
                fill_color="black", stroke_width=15, stroke_color="white",
                background_color="black", height=200, width=200, drawing_mode="freedraw", key="canvas_cnn"
            )
        with col2:
            st.write("**Hasil:**")
            if canvas.image_data is not None and np.sum(canvas.image_data.astype('uint8')) > 0:
                # Cek/Load Model
                if not os.path.exists(cnn_path):
                    st.warning("Model belum ada. Melatih sebentar...")
                    (x_train, y_train), _ = tf.keras.datasets.mnist.load_data()
                    x_train = x_train.reshape(-1,28,28,1)/255.0
                    model = create_cnn_model()
                    model.fit(x_train, y_train, epochs=1)
                    model.save(cnn_path)
                    st.success("Model dilatih!")
                
                model = tf.keras.models.load_model(cnn_path)
                
                # Preprocess
                img = cv2.cvtColor(canvas.image_data.astype('uint8'), cv2.COLOR_RGBA2GRAY)
                img = cv2.resize(img, (28, 28))
                img = img.reshape(1, 28, 28, 1).astype('float32') / 255.0
                
                pred = model.predict(img)
                label = np.argmax(pred)
                conf = np.max(pred) * 100
                
                st.success(f"Angka: **{label}**")
                st.info(f"Yakin: {conf:.1f}%")
    
    elif mode_t4 == "YOLO (Deteksi Objek)":
        uploaded_img = st.file_uploader("Upload Foto", type=['jpg', 'png', 'jpeg'])
        
        if uploaded_img:
            image = Image.open(uploaded_img)
            st.image(image, caption="Original", width=400)
            
            if st.button("Deteksi Objek"):
                with st.spinner("Sedang mendeteksi..."):
                    # Load YOLO (akan download otomatis)
                    model_yolo = YOLO('yolov8n.pt')
                    res = model_yolo(image)
                    res_plotted = res[0].plot()
                    
                    # Convert BGR to RGB
                    res_rgb = cv2.cvtColor(res_plotted, cv2.COLOR_BGR2RGB)
                    st.image(res_rgb, caption="Hasil Deteksi", width=400)
