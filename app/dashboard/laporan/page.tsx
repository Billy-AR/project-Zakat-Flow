// app/dashboard/laporan/page.tsx
import db from "@/utils/db";
import LaporanPengumpulanClient from "@/components/laporan/LaporanPengumpulan";
import { JenisBayar } from "@prisma/client";

export default async function LaporanPengumpulanPage() {
  // 1. Ambil data mentah dari database
  const rawList = await db.bayarZakat.findMany({
    include: { muzakki: true },
    orderBy: { createdAt: "desc" },
  });

  // 2. Hitung ringkasan
  const uniqueMuzakkiIds = new Set(rawList.map((item) => item.muzakkiId));
  const totalMuzakki = uniqueMuzakkiIds.size;
  const totalJiwa = rawList.reduce((sum, item) => sum + item.jumlah_tanggungan, 0);
  const totalBeras = rawList.reduce((sum, item) => (item.jenis_bayar === "BERAS" && item.bayar_beras ? sum + item.bayar_beras : sum), 0);
  const totalUang = rawList.reduce((sum, item) => (item.jenis_bayar === "UANG" && item.bayar_uang ? sum + item.bayar_uang : sum), 0);

  // 3. Serialize Date → string agar _props_ bisa dikirim ke Client Component
  const bayarZakatList = rawList.map((item) => ({
    id: item.id,
    muzakkiId: item.muzakkiId,
    nama_KK: item.nama_KK,
    jumlah_tanggungan: item.jumlah_tanggungan,
    jenis_bayar: item.jenis_bayar as JenisBayar,
    jumlah_tanggunganYangDibayar: item.jumlah_tanggunganYangDibayar,
    bayar_beras: item.bayar_beras,
    bayar_uang: item.bayar_uang,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    muzakki: {
      id: item.muzakki.id,
      nama_muzakki: item.muzakki.nama_muzakki,
      jumlah_tanggungan: item.muzakki.jumlah_tanggungan,
      keterangan: item.muzakki.keterangan,
      createdAt: item.muzakki.createdAt.toISOString(),
      updatedAt: item.muzakki.updatedAt.toISOString(),
    },
  }));

  return <LaporanPengumpulanClient totalMuzakki={totalMuzakki} totalJiwa={totalJiwa} totalBeras={totalBeras} totalUang={totalUang} bayarZakatList={bayarZakatList} />;
}
