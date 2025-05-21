# Zakat-Flow



Proyek ini menggunakan **Next.js**, **TypeScript**, dan **NeonDB** untuk database PostgreSQL yang dapat diskalakan dan serverless.

## 🚀 Fitur Utama

- **Next.js**: Framework React dengan dukungan SSR (Server-Side Rendering) dan SSG (Static Site Generation)
- **TypeScript**: Menggunakan tipe data statis untuk meningkatkan kualitas dan pengalaman pengembangan
- **NeonDB**: Database PostgreSQL serverless yang dapat diskalakan di cloud
- **Framer Motion**: Menambahkan animasi halus dan interaktif pada aplikasi

---

## 📋 Prasyarat

Pastikan Anda memiliki perangkat lunak berikut sebelum memulai:

- **Node.js** (v14.x atau lebih tinggi) - [Install Node.js](https://nodejs.org/)
- **npm** (v7.x atau lebih tinggi) atau **yarn** - [Install npm](https://www.npmjs.com/) atau [Install Yarn](https://yarnpkg.com/)
- **NeonDB** akun - [Daftar NeonDB](https://neon.tech)

---

## ⚡️ Instalasi

Ikuti langkah-langkah di bawah ini untuk menyiapkan proyek di mesin lokal Anda:

1. **Clone repositori**:

    ```bash
    git clone https://github.com/username/nama-repositori.git
    cd nama-repositori
    ```

2. **Instalasi dependensi**:

    Menggunakan **npm**:

    ```bash
    npm install
    ```

    Menggunakan **yarn**:

    ```bash
    yarn install
    ```

3. **Setel variabel lingkungan**:

    Buat file `.env` di root proyek dan tambahkan `DATABASE_URL`:

    ```bash
    DATABASE_URL=your_neondb_connection_string
    ```

4. **Jalankan aplikasi**:

    Menggunakan **npm**:

    ```bash
    npm run dev
    ```

    Menggunakan **yarn**:

    ```bash
    yarn dev
    ```

    Aplikasi Anda akan berjalan di [http://localhost:3000](http://localhost:3000).

---

## 🌐 Penyebaran

Untuk menyebarkan aplikasi ke **Vercel**:

1. Hubungkan repositori GitHub Anda ke **Vercel**.
2. Tambahkan variabel lingkungan `DATABASE_URL` pada pengaturan **Vercel**.
3. Klik "Deploy" dan aplikasi Anda akan siap online!

---

## 🎨 Menambahkan Animasi dengan Framer Motion

Tambahkan animasi halus pada aplikasi Anda menggunakan **Framer Motion**. Berikut adalah contoh untuk menambahkan animasi **fade-in** pada halaman:

### 1. Instal Framer Motion

Instal **Framer Motion**:

```bash
npm install framer-motion
