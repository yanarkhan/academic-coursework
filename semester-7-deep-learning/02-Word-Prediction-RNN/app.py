import gradio as gr
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense, SimpleRNN, GRU, Bidirectional

# --- PREPROCESSING DATA ---
def prepare_corpus(corpus_text):
    # 1. Bersihkan teks (lowercase)
    corpus_text = corpus_text.lower()
    
    # 2. Tokenisasi (Ubah kata jadi angka)
    tokenizer = Tokenizer()
    tokenizer.fit_on_texts([corpus_text])
    total_words = len(tokenizer.word_index) + 1
    
    # 3. Buat urutan N-gram
    input_sequences = []
    for line in corpus_text.split('.'): # Pisah per kalimat berdasarkan titik
        token_list = tokenizer.texts_to_sequences([line])[0]
        for i in range(1, len(token_list)):
            n_gram_sequence = token_list[:i+1]
            input_sequences.append(n_gram_sequence)
    
    # Cek jika corpus terlalu pendek
    if len(input_sequences) == 0:
        return None, None, None, None, None

    # 4. Padding (samakan panjang input)
    max_sequence_len = max([len(x) for x in input_sequences])
    input_sequences = np.array(pad_sequences(input_sequences, maxlen=max_sequence_len, padding='pre'))
    
    # 5. Pisah Data (X = Input, y = Target Label)
    X, y = input_sequences[:,:-1], input_sequences[:,-1]
    y = to_categorical(y, num_classes=total_words)
    
    return X, y, max_sequence_len, total_words, tokenizer

# --- ARSITEKTUR MODEL ---
def create_model(model_type, total_words, max_sequence_len):
    model = Sequential()
    
    # Layer Embedding
    model.add(Embedding(total_words, 64, input_length=max_sequence_len-1))
    
    # Layer Hidden (Sesuai Pilihan User)
    if model_type == "Vanilla RNN":
        model.add(SimpleRNN(64))
    elif model_type == "LSTM":
        model.add(LSTM(64))
    elif model_type == "GRU":
        model.add(GRU(64))
    elif model_type == "Bidirectional RNN":
        model.add(Bidirectional(SimpleRNN(64)))
        
    # Layer Output
    model.add(Dense(total_words, activation='softmax'))
    
    model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
    return model

# --- FUNGSI UTAMA (TRAINING & PREDICT) ---
def train_and_predict(training_text, model_choice, seed_text, next_words, epochs):
    
    # A. Validasi Input
    if not training_text or len(training_text.split()) < 5:
        return "Error: Teks pelatihan terlalu pendek. Masukkan paragraf yang panjang.", None
        
    # B. Persiapan Data
    X, y, max_sequence_len, total_words, tokenizer = prepare_corpus(training_text)
    
    if X is None:
        return "Error: Gagal memproses teks. Pastikan format teks benar.", None

    # C. Buat & Latih Model
    model = create_model(model_choice, total_words, max_sequence_len)
    history = model.fit(X, y, epochs=int(epochs), verbose=0)
    
    # D. Plot Grafik Akurasi
    fig = plt.figure(figsize=(10, 5))
    plt.plot(history.history['accuracy'], label='Akurasi Training')
    plt.title(f'Performa Model: {model_choice}')
    plt.xlabel('Epoch')
    plt.ylabel('Akurasi')
    plt.legend()
    plt.grid(True)
    
    # E. Prediksi Teks Baru
    output_text = seed_text
    current_text = seed_text # Variabel sementara untuk sliding window
    
    for _ in range(int(next_words)):
        token_list = tokenizer.texts_to_sequences([current_text])[0]
        token_list = pad_sequences([token_list], maxlen=max_sequence_len-1, padding='pre')
        
        # Prediksi probabilitas
        predicted = np.argmax(model.predict(token_list, verbose=0), axis=-1)
        
        output_word = ""
        for word, index in tokenizer.word_index.items():
            if index == predicted:
                output_word = word
                break
        
        # Update teks
        output_text += " " + output_word
        current_text += " " + output_word 
        
    return output_text, fig

# --- Gradio Interface ---
interface = gr.Interface(
    fn=train_and_predict,
    inputs=[
        gr.Textbox(
            lines=5, 
            label="Masukkan Teks untuk Pelatihan (Corpus)", 
            placeholder="Copy-paste teks panjang di sini...", 
            value="Kecerdasan buatan atau Artificial Intelligence adalah simulasi dari kecerdasan yang dimiliki oleh manusia yang dimodelkan di dalam mesin dan diprogram agar bisa berpikir seperti halnya manusia."
        ),
        gr.Radio(
            ["Vanilla RNN", "LSTM", "GRU", "Bidirectional RNN"], 
            label="Pilih Arsitektur Model", 
            value="Bidirectional RNN"
        ),
        gr.Textbox(
            label="Kata Awal (Seed Text)", 
            value="Kecerdasan buatan"
        ),
        gr.Slider(
            5, 100, value=20, step=5, 
            label="Jumlah Kata yang Dihasilkan"
        ),
        gr.Slider(
            10, 500, value=100, step=10, 
            label="Jumlah Epoch (Training)"
        )
    ],
    outputs=[
        gr.Textbox(label="Hasil Teks Ter-generate", lines=10, autoscroll=True, interactive=False), 
        gr.Plot(label="Grafik Performa Training")
    ],
    title="🤖 Generator Teks AI (RNN Variants)",
    description="Tugas Deep Learning - Prediksi Kata Berikutnya menggunakan Tensorflow & Gradio."
)

# Jalankan Aplikasi
if __name__ == "__main__":
    interface.launch()