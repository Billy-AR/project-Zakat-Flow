import MustahikLainnyaClient from "@/components/muzakki/distribusiLainya/DistribusiLainya";
import { getMustahikLainnyaList, getKategoriListAsc } from "@/utils/actions";

export default async function MustahikLainnyaPage() {
  const mustahikLainnyaList = await getMustahikLainnyaList();
  const kategoriList = await getKategoriListAsc();
  // Fetch mustahik lainnya data with related kategori

  return <MustahikLainnyaClient mustahikLainnyaList={mustahikLainnyaList} kategoriList={kategoriList} />;
}
