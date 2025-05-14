export const dynamic = "force-dynamic";

import BayarZakatClient from "@/components/muzakki/pengumpulanZakat/PengumpulanZakat";
import { getBayarZakatList, getMuzakkiNameList } from "@/utils/actions";

export default async function BayarZakatPage() {
  const bayarZakatList = await getBayarZakatList();
  const muzakkiList = await getMuzakkiNameList();
  // Fetch bayar zakat data with related muzakki

  return <BayarZakatClient bayarZakatList={bayarZakatList} muzakkiList={muzakkiList} />;
}
