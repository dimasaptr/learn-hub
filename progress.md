# 📌 Status Progres Terkini (Agile Checklist)

Papan komando untuk melacak progres pengerjaan harian tim sesuai pembagian tugas.

***

**[FASE 1] Fondasi & Persiapan Awal (SELESAI ✅)**
- [x] Inisialisasi Monorepo (`api` & `web`).
- [x] Setup `api`: Mode ketat ESM, Express, dan Prisma 7.7.0.
- [x] Setup `web`: Vite + React + TypeScript + **Tailwind CSS v4**.
- [x] Pengamanan Aturan Kerja: Pembentukan branch (`main`, `dev`, `feature-1`, `feature-2`).

**[FASE 2] Database & Arsitektur Utama (SELESAI ✅)**
- [x] **Database Schema**: Seluruh tabel utuh di dalam `/api/prisma/schema.prisma` beserta relasinya.
- [x] **Scaffolding Fitur Simon**: Terbentuk folder `events`, `transactions`, dll. beserta `controllers`, `services`, `repositories` dan dilock dengan `.gitkeep`.
- [x] **Auth Backend**: Registrasi, deteksi referral otomatis (hadiah Poin & Kupon), Login (hashing bcrypt & JWT), serta proteksi RBAC.
- [x] **Auth Frontend**: Halaman UI Register/Login berbasis Tailwind v4 dan penyiapan *React Router*.

**[FASE 3] Pengembangan Utama (SEDANG BERJALAN ⏳)**
- [ ] **Simon (Feature 1)**: Lakukan `git pull origin dev`. Mulai kerjakan Backend API untuk Event (Pencarian & Detail) di dalam wadah: `api/src/features/events/`.
- [ ] **Dimas (Feature 2)**: Menghubungkan form UI Frontend Auth dengan Endpoint API Backend yang barusan kita rilis.

***
> _Catatan: Silakan beri tanda checklist `[x]` setiap ada penyelesaian sub-fitur agar tracking paralel berjalan lancar._
