export const dynamic = "force-dynamic";

import LaporanDistribusiClient from "@/components/laporanDistribusi/LaporanDistribusiClient";
import { getMustahikWargaKategori, getMustahikLainnyaListIncl, getKategoriList } from "@/utils/actions";
export default async function LaporanDistribusiPage() {
  const kategoriList = await getKategoriList();
  const mustahikWarga = await getMustahikWargaKategori();
  const mustahikLainnya = await getMustahikLainnyaListIncl();

  // Calculate distribution for Mustahik Warga
  const distribusiWarga = kategoriList
    .map((kategori) => {
      const mustahikInKategori = mustahikWarga.filter((mustahik) => mustahik.kategoriId === kategori.id);

      const jumlahMustahik = mustahikInKategori.length;
      const totalBeras = mustahikInKategori.reduce((sum, mustahik) => sum + mustahik.hak, 0);

      return {
        kategoriId: kategori.id,
        namaKategori: kategori.nama_kategori,
        jumlahMustahik,
        hakBeras: kategori.jumlah_hak,
        totalBeras,
      };
    })
    .filter((item) => item.jumlahMustahik > 0);

  // Calculate distribution for Mustahik Lainnya
  const distribusiLainnya = kategoriList
    .map((kategori) => {
      const mustahikInKategori = mustahikLainnya.filter((mustahik) => mustahik.kategoriId === kategori.id);

      const jumlahMustahik = mustahikInKategori.length;
      const totalBeras = mustahikInKategori.reduce((sum, mustahik) => sum + mustahik.hak, 0);

      return {
        kategoriId: kategori.id,
        namaKategori: kategori.nama_kategori,
        jumlahMustahik,
        hakBeras: kategori.jumlah_hak,
        totalBeras,
      };
    })
    .filter((item) => item.jumlahMustahik > 0);

  // Calculate totals
  const totalBerasWarga = distribusiWarga.reduce((sum, item) => sum + item.totalBeras, 0);

  const totalBerasLainnya = distribusiLainnya.reduce((sum, item) => sum + item.totalBeras, 0);

  return <LaporanDistribusiClient distribusiWarga={distribusiWarga} distribusiLainnya={distribusiLainnya} totalBerasWarga={totalBerasWarga} totalBerasLainnya={totalBerasLainnya} />;
}
