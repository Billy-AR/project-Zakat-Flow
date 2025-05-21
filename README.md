# Next.js dengan TypeScript & NeonDB

Proyek sederhana menggunakan **Next.js**, **TypeScript**, dan **NeonDB** untuk database PostgreSQL serverless.

## Prasyarat

Pastikan Anda telah menginstal perangkat lunak berikut:

- **Node.js** (v14.x atau lebih tinggi) - [Install Node.js](https://nodejs.org/)
- **npm** (v7.x atau lebih tinggi) atau **yarn** - [Install npm](https://www.npmjs.com/) atau [Install Yarn](https://yarnpkg.com/)
- **NeonDB** akun - [Daftar NeonDB](https://neon.tech)

## Instalasi

1. **Clone repositori**:

    ```bash
    git clone https://github.com/username/nama-repositori.git
    cd nama-repositori
    ```

2. **Install dependensi**:

    Menggunakan **npm**:

    ```bash
    npm install
    ```

    Menggunakan **yarn**:

    ```bash
    yarn install
    ```

3. **Setel variabel lingkungan**:

    Buat file `.env` di direktori root dan tambahkan `DATABASE_URL`:

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

## Penyebaran

Untuk menyebarkan aplikasi ke **Vercel**:

1. Hubungkan repositori GitHub Anda ke **Vercel**.
2. Tambahkan `DATABASE_URL` pada **variabel lingkungan Vercel**.
3. Klik "Deploy" untuk membuat aplikasi Anda online.

---

## Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detailnya.
