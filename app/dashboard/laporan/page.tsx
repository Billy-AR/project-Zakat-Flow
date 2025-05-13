import db from "@/utils/db";
import LaporanPengumpulanClient from "@/components/laporan/LaporanPengumpulan";
import type { BayarZakat } from "@prisma/client";
import type { Muzakki } from "@/lib/types"; // atau lokasi tipe Muzakki-mu

type BayarZakatWithMuzakki = BayarZakat & { muzakki: Muzakki };
export default async function LaporanPengumpulanPage() {
  // Fetch all bayar zakat data with related muzakki
  const bayarZakatList: BayarZakatWithMuzakki[] = await db.bayarZakat.findMany({
    include: { muzakki: true },
    orderBy: { createdAt: "desc" },
  });

  // Calculate total muzakki (unique muzakki who paid zakat)
  const uniqueMuzakkiIds = new Set(bayarZakatList.map((item) => item.muzakkiId));
  const totalMuzakki = uniqueMuzakkiIds.size;

  // Calculate total jiwa (total tanggungan)
  const totalJiwa = bayarZakatList.reduce((sum, item) => sum + item.jumlah_tanggungan, 0);

  // Calculate total beras
  const totalBeras = bayarZakatList.reduce((sum, item) => {
    if (item.jenis_bayar === "BERAS" && item.bayar_beras) {
      return sum + item.bayar_beras;
    }
    return sum;
  }, 0);

  // Calculate total uang
  const totalUang = bayarZakatList.reduce((sum, item) => {
    if (item.jenis_bayar === "UANG" && item.bayar_uang) {
      return sum + item.bayar_uang;
    }
    return sum;
  }, 0);

  return <LaporanPengumpulanClient totalMuzakki={totalMuzakki} totalJiwa={totalJiwa} totalBeras={totalBeras} totalUang={totalUang} bayarZakatList={bayarZakatList} />;
}
