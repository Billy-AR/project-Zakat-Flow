import MustahikWargaClient from "@/components/muzakki/distribusi/DistribusiWarga";
import { getMustahikWargaList, getMuzakkiNameList, getKategoriListAsc } from "@/utils/actions";

export default async function MustahikWargaPage() {
  const mustahikWargaList = await getMustahikWargaList();
  const muzakkiList = await getMuzakkiNameList();
  const kategoriList = await getKategoriListAsc();

  return <MustahikWargaClient mustahikWargaList={mustahikWargaList} muzakkiList={muzakkiList} kategoriList={kategoriList} />;
}
