# 🚀 MASTER WORKFLOW: AGILE PARALLEL DEVELOPMENT
*(Untuk Tim 2 Orang: Dimas & Simon)*

Pendekatan ini menggabungkan contoh sebelumnya menjadi alur yang **jauh lebih cepat dan efisien**. Daripada menunggu seluruh Backend selesai baru membuat Frontend (yang rawan menumpuk di akhir proyek), kita menggunakan metode **"Selesaikan per Fitur"**: *Begitu satu endpoint API selesai dan diluluskan di Postman, langsung sikat UI Frontend-nya!*

---

## 🧱 FASE 1: FONDASI BERSAMA (Hari 1-2)
👉 **Dimas sebagai Eksekutor, Simon sebagai Reviewer.**

1. **Setup Monorepo**: Inisialisasi folder `api` (Express) & `web` (React/Vite).
2. **Desain Database (Krusial)**: Dimas merancang `schema.prisma`. **Wajib** panggil Simon lewat *Google Meet/Discord* untuk memastikan desain tabel `Event` & `Transaction` sudah cukup.
3. **Konfigurasi Shared**: Dimas menyetel Zod Error Handler, autentikasi JWT, Cloudinary, & koneksi Neon DB.
4. **Base Commit**: Dimas *push* kerangka ini ke branch `dev`. Simon melakukan `git pull origin dev` pertama kalinya.

---

## 🏎️ FASE 2: API & UI INTI (Hari 3-6)
👉 **Mulai Parallel. Fokus pada penyelesaian tulang punggung sistem.**

🔵 **DIMAS (Feature 2 - Auth & Users)**
1. **Backend**: Buat API Register, Login, & pemotongan Middleware JWT.
2. *Test Postman* ➔ Aman? Lanjut ke FE!
3. **Frontend**: Buat halaman Login & Register. Simpan Token di Zustand/Local Storage.

🟢 **SIMON (Feature 1 - Events)**
1. **Backend**: Buat API Create Event, Get Events (Filter & Search), Get Detail Event.
2. *Test Postman* ➔ Aman? Lanjut ke FE!
3. **Frontend**: Buat Landing Page (Daftar Event) & Halaman Detail Event. *(Bisa tes API menggunakan auth dummy sementara)*.

---

## 🧩 FASE 3: API & UI KOMPLEKS (Hari 7-10)
👉 **Memasuki logika berat, diskon, dan transaksi.**

🔵 **DIMAS (Feature 2 - Referral & Poin)**
1. **Backend**: Logika Generate Referral otomatis, pemberian kupon, dan injeksi *Points* saat user daftar.
2. **Frontend**: Buat Halaman Profil Pengguna untuk memunculkan saldo *Points* dan daftar *Coupons*.

🟢 **SIMON (Feature 1 - Voucher & Transaksi)**
1. **Backend**: Buat API Create Voucher spesifik (khusus Organizer).
2. **Backend**: API Checkout ➔ Kalkulasi pemotongan Voucher/Coupon/Points. *Gunakan SQL Transaction!*
3. **Frontend**: Halaman Checkout (Pemilihan diskon) & Upload Bukti Pembayaran.

---

## 📊 FASE 4: PENYELESAIAN & DASHBOARD (Hari 11-12)

🔵 **DIMAS (Feature 2)**
- Membuat **Event Management Dashboard (API + UI)**: Memunculkan statistik, grafik pengunjung, dan daftar transaksi. *(Karena backend Simon sudah menumpuk data)*.

🟢 **SIMON (Feature 1)**
- Membuat **Approval System & Reviews (API + UI)**: Tombol Organizer Terima/Tolak pembayaran di Dashboard. Form peserta memberi Review setelah acara selesai.

---

## 🕵️‍♂️ FASE 5: END-TO-END FINAL TEST (Hari 13)
👉 **Simulasi Mulus (Jalan Bareng). Cari Bug!**

1. Register akun baru pakai *referral*.
2. Login.
3. Klik "Become Organizer".
4. Buat Acara (Event) baru.
5. Pindah akun, cari acara tersebut, dan lakukan *Checkout*.
6. Upload bukti "Transfer".
7. Organizer "Approve" pembayaran.
8. Acara selesai ➔ Peserta memberi Review.

---

## 🚦 5 ATURAN EMAS (TIDAK BOLEH DILANGGAR)

1. **`Pull ➔ Coding ➔ Push`**
   Sebelum ngetik baris kode pertama setiap paginya, wajib `git pull origin dev` agar mendapat rilis kode terbaru.
2. **`1 File = 1 Owner`**
   Dimas jangan pernah ngedit file di folder *Events*, Simon jangan ngedit file di *Auth*. Kalau butuh perubahan, minta sang *owner* yang mengeditnya.
3. **`Hukum API ➔ Frontend`**
   Jangan pernah menyentuh kodingan Frontend (UI Visual) untuk sebuah fitur, apabila Endpoint Backend (API) dari fitur tersebut belum jalan di *Postman*.
4. **`Shared File = Rapat Pelataran`**
   Modifikasi file di folder `shared/` wajib izin dan beritahu tim.
5. **`Merge Kecil-Kecilan`**
   Misal: Fitur "Login API" selesai ➔ Langsung Pull Request ke `dev`. Jangan nge-push rombongan "Satu Fitur Selesai" karena rawan menimbulkan konflik besar.
