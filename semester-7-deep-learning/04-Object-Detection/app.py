import streamlit as st
import numpy as np
import cv2
from PIL import Image
import tensorflow as tf
from ultralytics import YOLO
import os
import cnn_model
from streamlit_drawable_canvas import st_canvas
import matplotlib.pyplot as plt

# --- KONFIGURASI HALAMAN ---
st.set_page_config(page_title="Task 4 - Object Detection", layout="wide")

# --- CSS CUSTOM ---
st.markdown("""
<style>
    .main-header { font-size: 24px; font-weight: bold; }
    .sub-header { font-size: 18px; color: #888; }
</style>
""", unsafe_allow_html=True)

# --- SIDEBAR (Sederhana) ---
with st.sidebar:
    st.title("Menu Aplikasi")
    st.write("Tugas Mata Kuliah Deep Learning")
    st.markdown("---")
    
    # Pilihan Model dipindah ke Sidebar agar lebih rapi
    st.subheader("Pilih Model AI")
    model_option = st.radio(
        "Mode:",
        ("CNN - Klasifikasi Angka (0-9)", "YOLO - Deteksi Objek (Foto)"),
        index=0
    )
    
    st.info("""
    **Keterangan:**
    - **CNN:** Gambar angka 0-9 di kanvas.
    - **YOLO:** Upload foto bebas (mobil, orang, dll).
    """)

# --- FUNGSI HELPER ---
@st.cache_resource
def load_cnn_model():
    model_path = 'model_mnist.h5'
    if not os.path.exists(model_path):
        with st.spinner("Melatih model CNN baru..."):
            cnn_model.train_and_save_model(model_path)
    return tf.keras.models.load_model(model_path)

@st.cache_resource
def load_yolo_model():
    return YOLO('yolov8n.pt') 

# --- HALAMAN UTAMA ---

st.title("Aplikasi Deep Learning: CNN & YOLO")

#LOGIKA 1: JIKA MEMILIH CNN (TAMPILKAN KANVAS)
if "CNN" in model_option:
    st.subheader("✍️ Mode CNN: Gambar Angka")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        # Kanvas untuk menggambar
        canvas_result = st_canvas(
            fill_color="black",
            stroke_width=15,
            stroke_color="white",
            background_color="black",
            height=280,
            width=280,
            drawing_mode="freedraw",
            key="canvas",
        )
        st.caption("Gambar satu digit angka (0-9) di tengah kotak hitam.")

    with col2:
        if canvas_result.image_data is not None and np.sum(canvas_result.image_data.astype('uint8')) > 0:
            try:
                # Load Model
                model = load_cnn_model()
                
                # Preprocessing Input Kanvas
                img_data = canvas_result.image_data.astype('uint8')
                img_gray = cv2.cvtColor(img_data, cv2.COLOR_RGBA2GRAY)
                img_resized = cv2.resize(img_gray, (28, 28))
                img_input = img_resized.reshape(1, 28, 28, 1).astype('float32') / 255.0
                
                # Tampilkan input yang dilihat komputer
                st.write("Input ke Model (28x28):")
                st.image(img_resized, width=100, clamp=True)
                
                # Prediksi
                prediction = model.predict(img_input)
                predicted_label = np.argmax(prediction)
                confidence = np.max(prediction) * 100
                
                # Hasil
                st.success(f"Prediksi: **Angka {predicted_label}**")
                st.info(f"Keyakinan: {confidence:.2f}%")
                
                # Grafik Probabilitas
                fig, ax = plt.subplots(figsize=(5, 2))
                bars = ax.bar(range(10), prediction[0], color='lightgray')
                bars[predicted_label].set_color('#4CAF50')
                ax.set_xticks(range(10))
                ax.set_title("Probabilitas")
                st.pyplot(fig, use_container_width=False)
                
            except Exception as e:
                st.error(f"Error: {e}")
        else:
            st.info("Silakan gambar angka di kanvas untuk melihat hasil prediksi.")

# LOGIKA 2: JIKA MEMILIH YOLO (TAMPILKAN UPLOAD FILE)
elif "YOLO" in model_option:
    st.subheader("📷 Mode YOLO: Deteksi Objek")
    
    uploaded_file = st.file_uploader("Upload foto (JPG/PNG)", type=['jpg', 'jpeg', 'png'])

    if uploaded_file is not None:
        # Tampilkan Gambar Asli
        image = Image.open(uploaded_file)
        st.image(image, caption="Gambar yang diupload", use_container_width=True)
        
        # Tombol Proses untuk YOLO
        if st.button("Proses", type="primary"):
            with st.spinner("Sedang mendeteksi..."):
                try:
                    model_yolo = load_yolo_model()
                    img_array = np.array(image)
                    
                    # Prediksi
                    results = model_yolo(img_array)
                    
                    # Render Hasil
                    res_plotted = results[0].plot()
                    res_rgb = cv2.cvtColor(res_plotted, cv2.COLOR_BGR2RGB)
                    
                    # Tampilkan Hasil Deteksi
                    st.image(res_rgb, caption="Hasil Deteksi YOLO", use_container_width=True)
                    
                    # List Objek
                    boxes = results[0].boxes
                    if len(boxes) > 0:
                        st.write("**Objek ditemukan:**")
                        for box in boxes:
                            name = model_yolo.names[int(box.cls[0])]
                            conf = float(box.conf[0])
                            st.write(f"- {name} ({conf:.2f})")
                    else:
                        st.warning("Tidak ada objek yang dikenali.")
                            
                except Exception as e:
                    st.error(f"Error YOLO: {e}")