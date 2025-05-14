export const dynamic = "force-dynamic";

import { getMuzakkiList } from "@/utils/actions";
import MuzakkiClient from "@/components/muzakki/client";

export default async function MuzakkiPage() {
  // Fetch muzakki data from the database
  const muzakkiList = await getMuzakkiList();

  return <MuzakkiClient muzakkiList={muzakkiList} />;
}
