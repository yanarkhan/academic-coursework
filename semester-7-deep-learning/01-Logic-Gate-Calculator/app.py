from flask import Flask, render_template, request
from logic import hitung_logika, buat_tabel_kebenaran

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    hasil_kalkulasi = None
    tabel_data = None
    tabel_columns = None
    
    input_a = 'True' # Default untuk tampilan awal
    input_b = 'True'
    operasi = 'AND'

    if request.method == 'POST':
        input_a = request.form.get('input_a')
        input_b = request.form.get('input_b')
        operasi = request.form.get('operasi')

        # 1. Hitung hasil
        hasil_bool = hitung_logika(input_a, input_b, operasi)
        hasil_kalkulasi = "True" if hasil_bool else "False"
        
        # 2. Buat tabel (Convert ke Dictionary agar mudah diatur di HTML)
        df = buat_tabel_kebenaran(operasi)
        tabel_data = df.to_dict(orient='records') # Mengubah baris jadi list of dict
        tabel_columns = df.columns.tolist()       # Nama kolom (A, B, Output)

    return render_template(
        'index.html', 
        hasil_kalkulasi=hasil_kalkulasi, 
        tabel_data=tabel_data,     # Kirim data mentah
        tabel_columns=tabel_columns, # Kirim nama kolom
        # Kirim balik input user agar dropdown tidak kereset setelah submit
        selected_a=input_a,
        selected_b=input_b,
        selected_op=operasi
    )

if __name__ == '__main__':
    app.run(debug=True)