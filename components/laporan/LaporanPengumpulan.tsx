// components/laporan/LaporanPengumpulan.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatRupiah } from "@/lib/utils";

// 1. Definisi tipe data untuk setiap baris daftar bayar zakat.
//    Semua Date sudah di-serialize jadi string.
export interface BayarZakatListItem {
  id: string;
  muzakkiId: string;
  nama_KK: string;
  jumlah_tanggungan: number;
  jenis_bayar: "BERAS" | "UANG";
  jumlah_tanggunganYangDibayar: number;
  bayar_beras: number | null;
  bayar_uang: number | null;
  createdAt: string;
  updatedAt: string;
  muzakki: {
    id: string;
    nama_muzakki: string;
    jumlah_tanggungan: number;
    keterangan: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

interface LaporanPengumpulanProps {
  totalMuzakki: number;
  totalJiwa: number;
  totalBeras: number;
  totalUang: number;
  bayarZakatList: BayarZakatListItem[];
}

export default function LaporanPengumpulanClient({ totalMuzakki, totalJiwa, totalBeras, totalUang, bayarZakatList }: LaporanPengumpulanProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [dateNow, setDateNow] = useState("");

  // Set tanggal hari ini dalam format lokal
  useEffect(() => {
    setDateNow(
      new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  // Handler ekspor PDF
  const handleExport = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();

      // Header
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("LAPORAN PENGUMPULAN ZAKAT FITRAH", W / 2, 15, { align: "center" });
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Tanggal Laporan: ${dateNow}`, W / 2, 25, { align: "center" });

      // Ringkasan
      doc.setFont("helvetica", "bold");
      doc.text("Ringkasan:", 14, 35);
      doc.setFont("helvetica", "normal");
      doc.text(`Total Muzakki: ${totalMuzakki} orang`, 14, 45);
      doc.text(`Total Jiwa: ${totalJiwa} orang`, 14, 50);
      doc.text(`Total Beras: ${totalBeras.toFixed(2)} kg`, 14, 55);
      doc.text(`Total Uang: ${formatRupiah(totalUang)}`, 14, 60);

      // Siapkan data tabel
      const head = [["No.", "Nama Muzakki", "Jumlah Tanggungan", "Jenis Bayar", "Beras (kg)", "Uang (Rp)", "Tanggal"]];
      const body = bayarZakatList.map((item, i) => [
        i + 1,
        item.muzakki.nama_muzakki,
        item.jumlah_tanggungan,
        item.jenis_bayar,
        item.jenis_bayar === "BERAS" && item.bayar_beras != null ? item.bayar_beras.toFixed(2) : "-",
        item.jenis_bayar === "UANG" && item.bayar_uang != null ? formatRupiah(item.bayar_uang).replace("Rp", "") : "-",
        new Date(item.createdAt).toLocaleDateString("id-ID"),
      ]);

      // Tambahkan baris total
      body.push(["", "TOTAL", totalJiwa, "", totalBeras.toFixed(2), formatRupiah(totalUang).replace("Rp", ""), ""]);

      // Render tabel
      autoTable(doc, {
        head,
        body,
        startY: 75,
        theme: "grid",
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontStyle: "bold" },
        footStyles: { fontStyle: "bold" },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });

      // Footer
      doc.setFontSize(10);
      doc.text(`© ${new Date().getFullYear()} Aplikasi Zakat Fitrah`, W / 2, H - 10, { align: "center" });

      // Simpan file
      doc.save("laporan-pengumpulan-zakat.pdf");
    } catch (error) {
      console.error("Error eksport PDF:", error);
      alert("Gagal mengekspor PDF: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      {/* Header & Tombol Ekspor */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Laporan Pengumpulan Zakat Fitrah</h1>
        <Button onClick={handleExport} disabled={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Mengekspor..." : "Ekspor ke PDF"}
        </Button>
      </div>

      {/* Ringkasan dalam Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Muzakki</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMuzakki}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Jiwa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJiwa}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Beras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBeras.toFixed(2)} kg</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Uang</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRupiah(totalUang)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Detail Pengumpulan */}
      <div className=" p-6 rounded-lg shadow-md overflow-x-auto dark:border-2">
        <h2 className="text-xl font-bold mb-4">Detail Pengumpulan Zakat</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-muted">
              <th className="border px-4 py-2">No.</th>
              <th className="border px-4 py-2">Nama Muzakki</th>
              <th className="border px-4 py-2">Jumlah Tanggungan</th>
              <th className="border px-4 py-2">Jenis Bayar</th>
              <th className="border px-4 py-2">Beras (kg)</th>
              <th className="border px-4 py-2">Uang (Rp)</th>
              <th className="border px-4 py-2">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {bayarZakatList.length === 0 ? (
              <tr>
                <td colSpan={7} className="border px-4 py-2 text-center">
                  Belum ada data pengumpulan zakat
                </td>
              </tr>
            ) : (
              bayarZakatList.map((item, i) => (
                <tr key={item.id} className={i % 2 === 0 ? "bg-white dark:bg-muted" : "bg-gray-50 dark:bg-muted"}>
                  <td className="border px-4 py-2 text-center">{i + 1}</td>
                  <td className="border px-4 py-2">{item.muzakki.nama_muzakki}</td>
                  <td className="border px-4 py-2 text-center">{item.jumlah_tanggungan}</td>
                  <td className="border px-4 py-2">{item.jenis_bayar}</td>
                  <td className="border px-4 py-2 text-right">{item.jenis_bayar === "BERAS" && item.bayar_beras != null ? item.bayar_beras.toFixed(2) : "-"}</td>
                  <td className="border px-4 py-2 text-right">{item.jenis_bayar === "UANG" && item.bayar_uang != null ? formatRupiah(item.bayar_uang) : "-"}</td>
                  <td className="border px-4 py-2">{new Date(item.createdAt).toLocaleDateString("id-ID")}</td>
                </tr>
              ))
            )}
            {/* Baris Total Footer */}
            <tr className="bg-gray-100 font-bold dark:bg-muted">
              <td className="border px-4 py-2" colSpan={2}>
                TOTAL
              </td>
              <td className="border px-4 py-2 text-center">{totalJiwa}</td>
              <td className="border px-4 py-2"></td>
              <td className="border px-4 py-2 text-right">{totalBeras.toFixed(2)} kg</td>
              <td className="border px-4 py-2 text-right">{formatRupiah(totalUang)}</td>
              <td className="border px-4 py-2"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
