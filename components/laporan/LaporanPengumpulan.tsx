"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatRupiah } from "@/lib/utils";
import { BayarZakat, Muzakki } from "@/lib/types";

interface LaporanPengumpulanProps {
  totalMuzakki: number;
  totalJiwa: number;
  totalBeras: number;
  totalUang: number;
  bayarZakatList: (BayarZakat & { muzakki: Muzakki })[];
}

export default function LaporanPengumpulanClient({ totalMuzakki, totalJiwa, totalBeras, totalUang, bayarZakatList }: LaporanPengumpulanProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [dateNow, setDateNow] = useState("");

  useEffect(() => {
    const now = new Date();
    setDateNow(
      now.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  const handleExport = () => {
    setIsExporting(true);
    try {
      // Inisialisasi PDF dengan ukuran A4
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

      // Persiapan tabel
      const head = [["No.", "Nama Muzakki", "Jumlah Tanggungan", "Jenis Bayar", "Beras (kg)", "Uang (Rp)"]];
      const body = bayarZakatList.map((item, i) => [
        i + 1,
        item.muzakki.nama_muzakki,
        item.jumlah_tanggungan,
        item.jenis_bayar === "BERAS" ? "Beras" : "Uang",
        item.jenis_bayar === "BERAS" && item.bayar_beras != null ? item.bayar_beras.toFixed(2) : "-",
        item.jenis_bayar === "UANG" && item.bayar_uang != null ? formatRupiah(item.bayar_uang).replace("Rp", "") : "-",
      ]);

      // Tambahkan baris total
      body.push(["", "TOTAL", totalJiwa, "", totalBeras.toFixed(2), formatRupiah(totalUang).replace("Rp", "")]);

      // Generate tabel
      autoTable(doc, {
        head: head,
        body: body,
        startY: 75,
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        footStyles: {
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      });

      // Footer
      doc.setFontSize(10);
      doc.text(`© ${new Date().getFullYear()} Aplikasi Zakat Fitrah`, W / 2, H - 10, {
        align: "center",
      });

      // Simpan PDF
      doc.save("laporan-pengumpulan-zakat.pdf");
    } catch (e) {
      console.error("Error saat mengekspor PDF:", e);
      alert("Gagal mengekspor PDF. Error: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      {/* Header & tombol ekspor */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Laporan Pengumpulan Zakat Fitrah</h1>
        <Button onClick={handleExport} disabled={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Mengekspor..." : "Ekspor ke PDF"}
        </Button>
      </div>

      {/* Ringkasan kartu */}
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

      {/* Tabel detail */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Detail Pengumpulan Zakat</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">No.</th>
              <th className="border px-4 py-2 text-left">Nama Muzakki</th>
              <th className="border px-4 py-2 text-left">Jumlah Tanggungan</th>
              <th className="border px-4 py-2 text-left">Jenis Bayar</th>
              <th className="border px-4 py-2 text-left">Beras (kg)</th>
              <th className="border px-4 py-2 text-left">Uang (Rp)</th>
            </tr>
          </thead>
          <tbody>
            {bayarZakatList.length === 0 ? (
              <tr>
                <td colSpan={6} className="border px-4 py-2 text-center">
                  Belum ada data pengumpulan zakat
                </td>
              </tr>
            ) : (
              bayarZakatList.map((item, i) => (
                <tr key={item.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border px-4 py-2">{i + 1}</td>
                  <td className="border px-4 py-2">{item.muzakki.nama_muzakki}</td>
                  <td className="border px-4 py-2 text-center">{item.jumlah_tanggungan}</td>
                  <td className="border px-4 py-2">{item.jenis_bayar === "BERAS" ? "Beras" : "Uang"}</td>
                  <td className="border px-4 py-2">{item.jenis_bayar === "BERAS" && item.bayar_beras != null ? item.bayar_beras.toFixed(2) : "-"}</td>
                  <td className="border px-4 py-2">{item.jenis_bayar === "UANG" && item.bayar_uang != null ? formatRupiah(item.bayar_uang) : "-"}</td>
                </tr>
              ))
            )}
            <tr className="bg-gray-100 font-bold">
              <td className="border px-4 py-2" colSpan={2}>
                TOTAL
              </td>
              <td className="border px-4 py-2 text-center">{totalJiwa}</td>
              <td className="border px-4 py-2"></td>
              <td className="border px-4 py-2">{totalBeras.toFixed(2)} kg</td>
              <td className="border px-4 py-2">{formatRupiah(totalUang)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
