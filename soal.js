// k = urutan jawaban benar (0 = pilihan pertama). Di Fase 2 kunci ini dipindah ke server.
const Q=(q,o,k)=>({q,o,k});
const TES={
numerical:{nama:"Numerical Reasoning",soal:[
Q("Perhatikan deret: 4, 7, 11, 16, 22, ... Angka berikutnya adalah ....",["28","29","30","31","32"],1),
Q("Perhatikan deret: 3, 6, 12, 24, 48, ... Angka berikutnya adalah ....",["72","84","96","108","120"],2),
Q("Harga sebuah tas adalah Rp240.000 dan mendapat diskon 15%. Harga yang harus dibayar adalah ....",["Rp196.000","Rp204.000","Rp208.000","Rp212.000","Rp216.000"],1),
Q("Perbandingan siswa laki-laki dan perempuan dalam sebuah kelas adalah 3 : 5. Jika jumlah seluruh siswa 32 orang, jumlah siswa perempuan adalah ....",["12","16","18","20","24"],3),
Q("Nilai lima siswa: 72, 78, 80, 85, dan 90. Satu siswa tambahan memperoleh nilai 95. Rata-rata keenam siswa tersebut (dibulatkan ke bilangan bulat terdekat) adalah ....",["81","82","83","84","85"],2),
Q("Sebuah sepeda menempuh 60 km dalam 3 jam. Jika kecepatannya tetap, jarak yang ditempuh dalam 5 jam adalah ....",["80 km","90 km","100 km","110 km","120 km"],2),
Q("Jika 3x + 7 = 31, maka nilai x adalah ....",["6","7","8","9","10"],2),
Q("Perhatikan pola: 2, 5, 11, 23, 47, ... Angka berikutnya adalah ....",["82","89","94","95","97"],3),
Q("Sebuah toko menjual 120 buku pada bulan Januari. Pada bulan Februari penjualan meningkat 25%. Jumlah buku yang terjual pada bulan Februari adalah ....",["135 buku","140 buku","145 buku","150 buku","155 buku"],3),
Q("Jumlah peserta: Senin 24, Selasa 30, Rabu 36, Kamis 42. Jika pola pertambahan tetap sama, jumlah peserta pada hari Jumat adalah ....",["46","48","50","52","54"],1)]},
mechanical:{nama:"Mechanical Reasoning",soal:[
Q("Sebuah papan dipakai sebagai tuas untuk mengangkat benda berat. Jika titik tumpu digeser lebih dekat ke benda yang diangkat, maka ....",["gaya yang diperlukan menjadi lebih besar","gaya yang diperlukan menjadi lebih kecil","berat benda menjadi lebih kecil","panjang benda menjadi bertambah","benda tidak dapat diangkat"],1),
Q("Fungsi utama katrol tetap adalah ....",["mengurangi massa benda","menghilangkan gaya gravitasi","mengubah arah gaya","menggandakan berat benda","memperbesar jarak yang ditempuh beban"],2),
Q("Roda gigi A (20 gigi) berputar searah jarum jam dan bersinggungan langsung dengan roda gigi B (40 gigi). Arah putaran roda gigi B adalah ....",["searah jarum jam","berlawanan arah jarum jam","tidak bergerak","berubah-ubah secara acak","sama dengan arah putaran A setelah satu putaran"],1),
Q("Roda gigi A memiliki 10 gigi dan roda gigi B memiliki 30 gigi. Jika A berputar 3 kali, B berputar ....",["1 kali","2 kali","3 kali","6 kali","9 kali"],0),
Q("Dua orang menaikkan kotak berat ke truk. Cara pertama memakai papan pendek dan curam, cara kedua memakai papan lebih panjang dan landai. Cara kedua akan ....",["membutuhkan gaya lebih besar","membutuhkan gaya lebih kecil","membuat berat kotak berkurang","membuat massa kotak bertambah","membutuhkan jarak yang lebih pendek"],1),
Q("Dua orang berat sama. Orang pertama memakai sepatu sol lebar, orang kedua memakai sepatu hak sangat kecil. Siapa yang memberikan tekanan lebih besar pada lantai?",["Orang pertama","Orang kedua","Keduanya sama","Bergantung pada tinggi badan","Tidak dapat ditentukan"],1),
Q("Tuas seimbang jika beban × lengan beban = kuasa × lengan kuasa. Beban 60 N berjarak 2 m dari titik tumpu, gaya diberikan pada jarak 4 m. Gaya minimum yang diperlukan adalah ....",["15 N","20 N","30 N","40 N","60 N"],2),
Q("Gagang pintu berdiameter lebih besar daripada porosnya. Gagang dibuat lebih besar ....",["agar massa pintu berkurang","agar gaya untuk memutar poros menjadi lebih kecil","agar pintu bergerak lebih cepat secara otomatis","agar gaya gravitasi pada pintu berkurang","agar poros tidak perlu berputar"],1),
Q("Sebuah pegas ditekan dengan gaya tertentu. Jika gaya diperbesar, maka secara umum ....",["pegas semakin sedikit berubah bentuk","pegas tidak berubah bentuk","pegas mengalami perubahan bentuk yang lebih besar","massa pegas menjadi lebih besar","gravitasi pada pegas menghilang"],2),
Q("Dibandingkan roda gigi depan kecil dan belakang besar, kombinasi roda gigi depan besar dan belakang kecil lebih sesuai ketika pengendara ingin ....",["kayuhan lebih ringan saat menanjak","kecepatan lebih tinggi di jalan datar","mengurangi massa sepeda","mengurangi putaran roda belakang","menghentikan pergerakan rantai"],1)]}
};
