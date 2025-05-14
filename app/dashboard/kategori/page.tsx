export const dynamic = "force-dynamic";

import MuzakkiKategori from "@/components/muzakki/muzakki-kategori/muzakkiKategori";
import { getMuzakkiKategoriList } from "@/utils/actions";

export default async function KategoriPage() {
  const kategoriList = await getMuzakkiKategoriList();

  return <MuzakkiKategori kategoriList={kategoriList} />;
}
