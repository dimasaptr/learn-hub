# Spesifikasi Proyek - Event Management Platform

## Tujuan Utama (Objective)
Tujuan utama MVP ini adalah membangun sebuah platform manajemen acara (Event Management Platform) yang simpel namun fungsional. Platform ini memungkinkan pihak penyelenggara (organizer) untuk membuat dan mempromosikan acara mereka, sementara peserta (customer) dapat mencari dan mendaftar pada acara tersebut.

## Tech Stack
- **Backend:** Node.js, Express, TypeScript, Prisma (v7.7.0), PostgreSQL (Neon)
- **Frontend:** React, Vite, Tailwind CSS (v4)
- **Validasi:** Zod
- **File Upload:** Cloudinary
- **Autentikasi:** JWT

## Arsitektur & Struktur Direktori
Sistem harus menggunakan arsitektur modular dengan pemisahan tanggung jawab (Separation of Concerns) yang jelas, misalnya pola Controller, Service, dan Repository.

**Gambaran Struktur Folder (Tanpa folder "Feature" yang spesifik):**
```text
src/
├── web/       # Frontend Application (React/Vite)
│   ├── assets/          # Gambar, ikon, dll.
│   ├── components/      # Komponen UI yang dapat digunakan kembali (Reusable)
│   ├── features/        # Komponen/logika spesifik per fitur (events, auth, dst.)
│   ├── hooks/           # Custom React Hooks
│   ├── layouts/         # Tata letak halaman utama (seperti Navbar, Footer, Sidebar)
│   ├── pages/           # Komponen halaman utama (Routing)
│   ├── services/        # Endpoint API calls menggunakan modul penarik data (cth: Axios)
│   ├── store/           # Manajemen Local/Global State (Zustand/Redux/Context)
│   ├── types/           # Deklarasi tipe TypeScript (Interfaces, Types)
│   └── utils/           # Fungsi helper / utilitas pembantu
└── api/       # Backend Application (Express)
    ├── features/
    │   ├── events/
    │   ├── transactions/
    │   ├── vouchers/
    │   ├── reviews/
    │   ├── auth/
    │   ├── users/
    │   ├── referrals/
    │   └── dashboard/
    └── shared/
        ├── middlewares/
        ├── config/
        ├── utils/
        └── types/
```

### Standar Header File (FILE INFO)
Pada setiap file di backend (baik itu Service, Controller, Type, maupun file inti lainnya), **wajib** menambahkan komentar header informasi (FILE INFO) pada baris teratas. Ini berguna untuk mengetahui status, pembagian tugas (Feature 1 atau 2), dan siapa penanggung jawab kode/pemilik (owner)-nya. Contoh:

```typescript
/**
 * =========================================
 * FILE INFO
 * =========================================
 * File Name   : auth.service.ts
 * Type        : Service
 * Feature     : Feature 2
 * Owner       : Dimas
 * Description : Handle authentication logic (login, register, token)
 * Source Path : src/features/auth/services/auth.service.ts
 * Used In     : Auth Controller
 * Status      : ACTIVE
 * =========================================
 */
```

## Role Pengguna (Roles)
1. **CUSTOMER**: Dapat mencari acara, mendaftar/membeli tiket, memberikan ulasan, serta menggunakan kode referral.
2. **ORGANIZER**: Dapat membuat acara, mengatur voucher, dan menyetujui/menolak transaksi pembayaran.
*Catatan: Seorang Customer otomatis dapat menjadi Organizer secara instan melalui tombol "Become Organizer" tanpa konfirmasi dari admin.*

## Fitur Utama & Logika Sistem

### 1. Pencarian Acara (Event Discovery) & Detail Acara
- Halaman *Landing Page* menampilkan daftar acara dengan filter pencarian per kategori dan lokasi.
- Terdapat *Search Bar* yang menggunakan fungsi **debounce**.
- Aplikasi wajib responsif penuh di berbagai perangkat.
- Seluruh harga pembayaran hanya menggunakan IDR (Rupiah).
- Tangani properly jika tidak ada data saat filter dan pencarian digunakan ("No events found").
- **Siklus Hidup Acara (Lifecycle)**: `DRAFT` ➔ `PUBLISHED` ➔ `ARCHIVED` ➔ `CANCELED`.
  - Acara dianggap selesai jika `endDate < waktu sekarang`.
  - Setelah 7 hari sejak selesai, acara akan otomatis berpindah ke status `ARCHIVED`.

### 2. Transaksi Tiket (Event Transactions)
- Siklus alur *manual transfer*: Pengguna memilih tiket ➔ *Check out* ➔ Muncul timer 2 jam untuk unggah bukti pembayaran ➔ Organizer review.
- **Status Transaksi**: `WAITING_FOR_PAYMENT`, `WAITING_FOR_ADMIN_CONFIRMATION`, `DONE`, `REJECTED`, `EXPIRED`, `CANCELED`.
- Apabila Organizer tidak menindaklanjuti bukti transfer selama 3 hari, akan otomatis `CANCELED`.
- Sistem melakukan *Rollback*: mengembalikan kuota tersisa (seat), poin (points), kupon, dan voucher apabila proses transaksi berujung Gagal, Expired, atau Dibatalkan.
- Sistem notifikasi Email dikirim ketika Organizer melakukan konfirmasi Terima/Tolak pembayaran.
- **Atur Wajib**: Gunakan **SQL Transaction** ketika ada aksi pengubahan/modifikasi yang melibatkan lebih dari satu tabel/data untuk menjamin konsistensi di *database*.

### 3. Logika Diskon (Voucher, Coupon, & Points)
- **Voucher**: Dibuat oleh Organizer untuk acara spesifik, mempunyai kuota dan periode berlaku terbatas.
- **Coupon (Reward)**: Dari sistem, dapat digunakan untuk *semua* acara (misal didapat dari pendaftaran via Referral, durasi 3 bulan).
- **Points**: Didapatkan si empunya referral (10.000 titik poin per member baru). Masa berlaku 3 bulan dengan skema pemotongan logika **FIFO**.
- **Aturan Penggunaan Check-Out**:
  - Hanya boleh memakai **satu** tipe pemotongan utama: *Voucher* spesifik ATAU *Coupon* Reward.
  - Poin (Points) boleh dapat digunakan berbarengan di atas *Voucher* / *Coupon*.
  - Total transaksi akhir tidak boleh minus (minimal 0/Free).
  - Sisa uang diskon akan otomatis hangus (tidak dikembalikan).

### 4. Sistem Referral & Autentikasi Pengguna
- Pengguna yang masuk menggunakan nomor kode referensi mendapat kupon, dan yang membagikan dapat Poin.
- Pembuatan akun wajib (Register, Login), dengan proteksi rute di Frontend berbasis peran (*Role-Based Access*).
- Kode referensi (*referral code*) dibuat pada saat pendaftaran pengguna baru dan tak tertukar/diedit.
- Sistem Manajemen Profil: Merubah gambar profil, password reset (Lupa Sandi).
- **Atur Wajib**: Implementasi *Popup Dialog Confirmation* saat terdapat aksi memodifikasi suatu data sensitif/kritis.

### 5. Review & Rating (Ulasan)
- Review hanya dapat diunggah dengan syarat: Status Booking `DONE` **DAN** masa acara telah berlalu/usai (peserta hadir).
- Profil Organizer menampilkan agregat skor rating serta kumpulan *reviews*.

### 6. Event Management Dashboard (Untuk Organizer)
- Halaman kelola acara secara bebas (Edit/Tambah/Update), penerimaan transaksi, beserta visualisasi daftar dan profil peserta (Attendee List -- memuat nama peserta, jumlah beli, harga lunas).
- Menampilkan grafik dan laporan statistik jumlah interaksi pengguna (dibagi dalam laporan tahun, bulan, hingga harian).

## Alur Kerja Tim & Git Kolaborasi
- **Branch**: `main` (production), `dev` (integration), cabang `feature-1` & `feature-2` buat paralel.
- **Rule Git Utama**: `pull` ➔ `coding` ➔ `commit` ➔ `push`.
- **Aturan Pemilik File**:
  - Hindari kolisi kode: **1 file = 1 owner**. Jangan secara diam-diam edit file orang lain secara sepihak.
  - Sisi shared modul/API jika dieksekusi pembaruan/modifikasi maka **wajib** dikomunikasikan di grup.
  - Pasanglah Header (FILE INFO) di tiap awal file.
- Setiap alur / Flow di test memakai **Unit Test**.
- Pertahankan struktur rapi dan penulisan standar konsistensi berbasis struktur Controller ➔ Service ➔ Repository di layer server. Buat data palsu (seeds) jika dibutuhkan *testcase* terkait filter dan search.

---
**Instruksi Tambahan (Bagi Programmer/AI):**
Gunakan file rancangan *high-level* ini sebagai kerangka arahan di pengembangan tahap selanjutnya. Perhatikan skema validasi Zod terlebih dahulu, proteksi struktur Role pengguna sedari awal, serta pemetaan integrasi Prisma yang sesuai guna mencegah kebocoran poin / inkonsistensi transaksi.

## Rencana Pengembangan Selanjutnya (Opsional / Jika Ada Waktu Sisa)
- **Sistem Pembayaran Terotomasi (Payment Gateway)**: Pada prioritas utama pengembangan MVP saat ini, *programmer* diwajibkan untuk 100% berfokus menyelesaikan fungsi *manual transfer* dan *upload* bukti bayar beserta alur pengecekannya. **JIKA SEMUA FITUR INTI SUDAH SELESAI DAN MASIH ADA WAKTU TERSISA**, barulah kerjakan integrasi transaksi menggunakan [Midtrans Sandbox Simulator](https://simulator.sandbox.midtrans.com/) (Status fitur ini adalah *Nice to Have* / Bonus).

---

# 🚀 PANDUAN KERJA (MASTER WORKFLOW): AGILE PARALLEL
*(Untuk Tim 2 Orang: Dimas & Simon)*

Pendekatan ini menggunakan metode **"Selesaikan per Fitur" (Vertical Slicing)**: *Begitu satu endpoint API selesai dan diluluskan di Postman, langsung kerjakan UI Frontend-nya!*

## 🧱 FASE 1: FONDASI BERSAMA (Hari 1-2)
👉 **Dimas sebagai Eksekutor, Simon sebagai Reviewer.**

1. **Setup Monorepo**: Inisialisasi folder `api` (Express) & `web` (React/Vite).
2. **Desain Database (Krusial)**: Dimas merancang `schema.prisma`. **Wajib** panggil Simon lewat *Google Meet/Discord* untuk memastikan desain tabel `Event` & `Transaction` sinkron.
3. **Konfigurasi Shared**: Dimas menyetel Zod Error Handler, autentikasi JWT, Cloudinary, & koneksi Neon DB.
4. **Base Commit**: Dimas *push* kerangka ke branch `dev`. Simon melakukan `git pull origin dev` pertama kalinya.

## 🏎️ FASE 2: API & UI INTI (Hari 3-6)

🔵 **DIMAS (Feature 2 - Auth & Users)**
1. **Backend**: Buat API Register, Login, & pemotongan Middleware JWT.
2. *Test Postman* ➔ Aman? Lanjut ke FE!
3. **Frontend**: Buat halaman Login & Register. Simpan Token.

🟢 **SIMON (Feature 1 - Events)**
1. **Backend**: Buat API Create Event, Get Events, Get Detail Event.
2. *Test Postman* ➔ Aman? Lanjut ke FE!
3. **Frontend**: Buat Landing Page & Halaman Detail Event.

## 🧩 FASE 3: API & UI KOMPLEKS (Hari 7-10)

🔵 **DIMAS (Feature 2 - Referral & Poin)**
1. **Backend**: Logika Generate Referral, kupon, dan injeksi *Points*.
2. **Frontend**: Halaman Profil memunculkan saldo *Points* dan *Coupons*.

🟢 **SIMON (Feature 1 - Voucher & Transaksi)**
1. **Backend**: API Create Voucher & API Checkout. *Gunakan SQL Transaction!*
2. **Frontend**: Halaman Checkout & Upload Bukti Pembayaran.

## 📊 FASE 4: PENYELESAIAN & DASHBOARD (Hari 11-12)

🔵 **DIMAS (Feature 2)**
- Membuat **Event Management Dashboard (API + UI)**: Memunculkan statistik, dan daftar transaksi. 

🟢 **SIMON (Feature 1)**
- Membuat **Approval System & Reviews (API + UI)**: Tombol Terima/Tolak pembayaran di Dashboard. Form peserta memberi Review.

## 🕵️‍♂️ FASE 5: END-TO-END FINAL TEST (Hari 13)
- Register pakai referal ➔ Login ➔ Buat Acara ➔ Checkout akun lain ➔ Upload Transfer ➔ Approve ➔ Selesai ➔ Review.

## 🌳 STRATEGI BRANCHING & GIT FLOW (SUPER PENTING)

**Total Branch yang Digunakan HANYA 4:**
1. **`main`** (PRODUCTION / FINAL): Berisi *project final* yang sudah siap demo. 
   *(⛔ Dilarang coding & dilarang commit langsung ke branch ini!)*
2. **`dev`** (INTEGRATION): Tempat test gabungan fitur dari Dimas & Simon. 
   *(⛔ Dilarang coding langsung di sini, branch ini eksklusif hanya untuk menerima merge dari branch feature).*
3. **`feature-1`** (SIMON): Tempat khusus Simon koding (menampung pengerjaan Event, Voucher, Transaction).
4. **`feature-2`** (DIMAS): Tempat khusus Dimas koding (menampung pengerjaan Auth, User, Referral, Dashboard).

*Aturan Dasar Arus Branch (Flow Dasar):* 
**`coding HANYA di feature` ➔ `merge ke dev` ➔ `bila semua selesai, merge dev ke main`**.

### 💻 Contoh Alur Harian (Terminal Bash)

**1. SEBELUM NGODING (Ambil update temanmu yang terbaru):**
```bash
git checkout dev
git pull

git checkout feature-2   # (Simon menggantinya dengan feature-1)
git merge dev
```

**2. SETELAH NGODING (Simpan hasil kerjamu di branch-mu sendiri):**
```bash
git add .
git commit -m "feat: login auth done"
git push
```

**3. KALAU MAU GABUNG (Pindahkan kodemu ke wadah gabungan):**
```bash
git checkout dev
git pull                 # (Pastikan aman dulu)
git merge feature-2
git push
```

## 🚦 5 ATURAN EMAS (TIDAK BOLEH DILANGGAR)
1. **`Coding Hanya di Feature Branch`** (Jangan pernah ngetik baris kode satupun saat kamu sedang berada di branch `dev` atau `main`).
2. **`1 File = 1 Owner`** (Silang owner sangat dilarang. Jangan biarkan 2 orang mengedit 1 file yang sama).
3. **`Shared File = Wajib Komunikasi`** (Boleh mengubah folder `shared/`, TAPI syaratnya: *Bilang dulu di grup* ➔ *Pull update terbaru* ➔ *Baru edit*).
4. **`Hukum API ➔ Frontend`** (Jangan pernah *coding* tampilan antarmuka (FE) web sebelum Endpoint API(BE)-nya dipastikan jalan).
5. **`Merge Tiap Fitur Kecil Selesai`** (Jangan menunggu semua target kerjamu baru digabung. Selesai buat Auth API? Langsung lempar mergenya ke `dev` agar kodemu tidak basi/konflik).
