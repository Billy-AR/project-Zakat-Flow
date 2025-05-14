export const dynamic = "force-dynamic";

import db from "@/utils/db";
import DashboardClient from "@/components/MainDashboard/dashboard";

export default async function DashboardPage() {
  // Get counts of various data
  const totalMuzakki = await db.muzakki.count();
  const totalKategori = await db.kategoriMustahik.count();
  const totalBayarZakat = await db.bayarZakat.count();
  const totalMustahikWarga = await db.mustahikWarga.count();
  const totalMustahikLainnya = await db.mustahikLainnya.count();

  // Calculate total beras collected
  const bayarZakatList = await db.bayarZakat.findMany();
  const totalBeras = bayarZakatList.reduce((sum, item) => {
    if (item.jenis_bayar === "BERAS" && item.bayar_beras) {
      return sum + item.bayar_beras;
    }
    return sum;
  }, 0);

  // Calculate total uang collected
  const totalUang = bayarZakatList.reduce((sum, item) => {
    if (item.jenis_bayar === "UANG" && item.bayar_uang) {
      return sum + item.bayar_uang;
    }
    return sum;
  }, 0);

  return (
    <DashboardClient
      totalMuzakki={totalMuzakki}
      totalKategori={totalKategori}
      totalBayarZakat={totalBayarZakat}
      totalMustahikWarga={totalMustahikWarga}
      totalMustahikLainnya={totalMustahikLainnya}
      totalBeras={totalBeras}
      totalUang={totalUang}
    />
  );
}
