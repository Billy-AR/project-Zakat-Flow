"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface KategoriDistribusi {
  kategoriId: string;
  namaKategori: string;
  jumlahMustahik: number;
  hakBeras: number;
  totalBeras: number;
}

interface LaporanDistribusiProps {
  distribusiWarga: KategoriDistribusi[];
  distribusiLainnya: KategoriDistribusi[];
  totalBerasWarga: number;
  totalBerasLainnya: number;
}

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

export default function LaporanDistribusiClient({ distribusiWarga, distribusiLainnya, totalBerasWarga, totalBerasLainnya }: LaporanDistribusiProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState("warga");
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

  const totalKeseluruhan = totalBerasWarga + totalBerasLainnya;

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Inisialisasi PDF dengan ukuran A4
      const doc = new jsPDF();
      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();

      // Tambahkan header laporan
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("LAPORAN DISTRIBUSI ZAKAT FITRAH", W / 2, 15, { align: "center" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Tanggal Laporan: ${dateNow}`, W / 2, 25, { align: "center" });

      // Tambahkan ringkasan data
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Ringkasan:", 14, 35);

      doc.setFont("helvetica", "normal");
      doc.text(`Total Distribusi Warga: ${totalBerasWarga.toFixed(2)} kg`, 14, 45);
      doc.text(`Total Distribusi Lainnya: ${totalBerasLainnya.toFixed(2)} kg`, 14, 50);
      doc.text(`Total Keseluruhan: ${totalKeseluruhan.toFixed(2)} kg`, 14, 55);

      // --- BAGIAN A: DISTRIBUSI KE MUSTAHIK WARGA ---
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("A. Distribusi ke Mustahik Warga:", 14, 70);

      // Persiapan data untuk tabel A
      const headA = [["No.", "Kategori Mustahik", "Hak Beras (kg)", "Jumlah KK", "Total Beras (kg)"]];
      const bodyA = distribusiWarga.map((item, index) => [index + 1, item.namaKategori, item.hakBeras.toFixed(2), item.jumlahMustahik, item.totalBeras.toFixed(2)]);

      // Tambahkan baris total
      bodyA.push(["", "TOTAL", "", distribusiWarga.reduce((sum, item) => sum + item.jumlahMustahik, 0), totalBerasWarga.toFixed(2)]);

      // Generate tabel A
      autoTable(doc, {
        head: headA,
        body: bodyA,
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

      // --- BAGIAN B: DISTRIBUSI KE MUSTAHIK LAINNYA ---
      // Dapatkan posisi Y setelah tabel pertama
      const finalY = doc.lastAutoTable.finalY + 15;

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("B. Distribusi ke Mustahik Lainnya:", 14, finalY);

      // Persiapan data untuk tabel B
      const headB = [["No.", "Kategori Mustahik", "Hak Beras (kg)", "Jumlah KK", "Total Beras (kg)"]];
      const bodyB = distribusiLainnya.map((item, index) => [index + 1, item.namaKategori, item.hakBeras.toFixed(2), item.jumlahMustahik, item.totalBeras.toFixed(2)]);

      // Tambahkan baris total
      bodyB.push(["", "TOTAL", "", distribusiLainnya.reduce((sum, item) => sum + item.jumlahMustahik, 0), totalBerasLainnya.toFixed(2)]);

      // Generate tabel B
      autoTable(doc, {
        head: headB,
        body: bodyB,
        startY: finalY + 5,
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

      // --- RINGKASAN DISTRIBUSI ---
      // Dapatkan posisi Y setelah tabel kedua
      const finalY2 = doc.lastAutoTable.finalY + 15;

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Ringkasan Distribusi Zakat Fitrah:", 14, finalY2);

      // Persiapan data untuk tabel ringkasan
      const totalKKWarga = distribusiWarga.reduce((sum, item) => sum + item.jumlahMustahik, 0);
      const totalKKLainnya = distribusiLainnya.reduce((sum, item) => sum + item.jumlahMustahik, 0);
      const persentaseWarga = totalKeseluruhan > 0 ? ((totalBerasWarga / totalKeseluruhan) * 100).toFixed(2) : "0.00";
      const persentaseLainnya = totalKeseluruhan > 0 ? ((totalBerasLainnya / totalKeseluruhan) * 100).toFixed(2) : "0.00";

      const headSummary = [["Jenis Distribusi", "Jumlah KK", "Total Beras (kg)", "Persentase"]];
      const bodySummary = [
        ["Distribusi ke Mustahik Warga", totalKKWarga, totalBerasWarga.toFixed(2), `${persentaseWarga}%`],
        ["Distribusi ke Mustahik Lainnya", totalKKLainnya, totalBerasLainnya.toFixed(2), `${persentaseLainnya}%`],
        ["TOTAL", totalKKWarga + totalKKLainnya, totalKeseluruhan.toFixed(2), "100.00%"],
      ];

      // Generate tabel ringkasan
      autoTable(doc, {
        head: headSummary,
        body: bodySummary,
        startY: finalY2 + 5,
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

      // Tambahkan footer
      doc.setFontSize(10);
      doc.text(`© ${new Date().getFullYear()} Aplikasi Zakat Fitrah`, W / 2, H - 10, {
        align: "center",
      });

      // Simpan PDF
      doc.save("laporan-distribusi-zakat.pdf");
    } catch (error) {
      console.error("Error saat mengekspor PDF:", error);
      alert("Gagal mengekspor PDF. Error: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Laporan Distribusi Zakat Fitrah</h1>
        <Button onClick={handleExport} disabled={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Mengekspor..." : "Ekspor ke PDF"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Distribusi Warga</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBerasWarga.toFixed(2)} kg</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Distribusi Lainnya</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBerasLainnya.toFixed(2)} kg</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Keseluruhan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalKeseluruhan.toFixed(2)} kg</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="warga" className="mt-6" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="warga">Distribusi ke Mustahik Warga</TabsTrigger>
          <TabsTrigger value="lainnya">Distribusi ke Mustahik Lainnya</TabsTrigger>
        </TabsList>

        <TabsContent value="warga">
          <div className="border-2 p-6 rounded-lg shadow-md dark:bg-muted">
            <h2 className="text-xl font-bold mb-4">A. Distribusi ke Mustahik Warga</h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-muted">
                    <th className="border px-4 py-2 text-left">No.</th>
                    <th className="border px-4 py-2 text-left">Kategori Mustahik</th>
                    <th className="border  px-4 py-2 text-left">Hak Beras (kg)</th>
                    <th className="border px-4 py-2 text-left">Jumlah KK</th>
                    <th className="border  px-4 py-2 text-left">Total Beras (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {distribusiWarga.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="border border-muted px-4 py-2 text-center">
                        Belum ada data distribusi untuk mustahik warga
                      </td>
                    </tr>
                  ) : (
                    distribusiWarga.map((item, index) => (
                      <tr key={item.kategoriId} className={index % 2 === 0 ? "bg-white dark:bg-muted" : "bg-gray-50 dark:bg-muted"}>
                        <td className="border  px-4 py-2">{index + 1}</td>
                        <td className="border  px-4 py-2">{item.namaKategori}</td>
                        <td className="border  px-4 py-2">{item.hakBeras.toFixed(2)}</td>
                        <td className="border  px-4 py-2 text-center">{item.jumlahMustahik}</td>
                        <td className="border  px-4 py-2">{item.totalBeras.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                  {distribusiWarga.length > 0 && (
                    <tr className="bg-gray-100 font-bold dark:bg-muted">
                      <td className="border  px-4 py-2" colSpan={3}>
                        TOTAL
                      </td>
                      <td className="border  px-4 py-2 text-center">{distribusiWarga.reduce((sum, item) => sum + item.jumlahMustahik, 0)}</td>
                      <td className="border  px-4 py-2">{totalBerasWarga.toFixed(2)} kg</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="lainnya">
          <div className="border-2 dark:bg-muted p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">B. Distribusi ke Mustahik Lainnya</h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-muted">
                    <th className="border  px-4 py-2 text-left">No.</th>
                    <th className="border  px-4 py-2 text-left">Kategori Mustahik</th>
                    <th className="border  px-4 py-2 text-left">Hak Beras (kg)</th>
                    <th className="border  px-4 py-2 text-left">Jumlah KK</th>
                    <th className="border  px-4 py-2 text-left">Total Beras (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {distribusiLainnya.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="border-2 px-4 py-2 text-center">
                        Belum ada data distribusi untuk mustahik lainnya
                      </td>
                    </tr>
                  ) : (
                    distribusiLainnya.map((item, index) => (
                      <tr key={item.kategoriId} className={index % 2 === 0 ? "bg-white dark:bg-muted" : "bg-gray-50 dark:bg-muted"}>
                        <td className="border  px-4 py-2">{index + 1}</td>
                        <td className="border  px-4 py-2">{item.namaKategori}</td>
                        <td className="border  px-4 py-2">{item.hakBeras.toFixed(2)}</td>
                        <td className="border  px-4 py-2 text-center">{item.jumlahMustahik}</td>
                        <td className="border  px-4 py-2">{item.totalBeras.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                  {distribusiLainnya.length > 0 && (
                    <tr className="bg-gray-100 dark:bg-muted font-bold">
                      <td className="border-2 px-4 py-2" colSpan={3}>
                        TOTAL
                      </td>
                      <td className="border-2 px-4 py-2 text-center">{distribusiLainnya.reduce((sum, item) => sum + item.jumlahMustahik, 0)}</td>
                      <td className="border-2 px-4 py-2">{totalBerasLainnya.toFixed(2)} kg</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Separator className="my-8" />

      <div className="border-2 dark:bg-muted p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Ringkasan Distribusi Zakat Fitrah</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-muted">
                <th className="border  px-4 py-2 text-left">Jenis Distribusi</th>
                <th className="border  px-4 py-2 text-left">Jumlah KK</th>
                <th className="border  px-4 py-2 text-left">Total Beras (kg)</th>
                <th className="border  px-4 py-2 text-left">Persentase</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border  px-4 py-2">Distribusi ke Mustahik Warga</td>
                <td className="border px-4 py-2 text-center">{distribusiWarga.reduce((sum, item) => sum + item.jumlahMustahik, 0)}</td>
                <td className="border  px-4 py-2">{totalBerasWarga.toFixed(2)} kg</td>
                <td className="border  px-4 py-2">{totalKeseluruhan > 0 ? ((totalBerasWarga / totalKeseluruhan) * 100).toFixed(2) : "0.00"}%</td>
              </tr>
              <tr>
                <td className="border  px-4 py-2">Distribusi ke Mustahik Lainnya</td>
                <td className="border  px-4 py-2 text-center">{distribusiLainnya.reduce((sum, item) => sum + item.jumlahMustahik, 0)}</td>
                <td className="border  px-4 py-2">{totalBerasLainnya.toFixed(2)} kg</td>
                <td className="border  px-4 py-2">{totalKeseluruhan > 0 ? ((totalBerasLainnya / totalKeseluruhan) * 100).toFixed(2) : "0.00"}%</td>
              </tr>
              <tr className="dark:bg-muted font-bold">
                <td className="border px-4 py-2">TOTAL</td>
                <td className="border  px-4 py-2 text-center">{distribusiWarga.reduce((sum, item) => sum + item.jumlahMustahik, 0) + distribusiLainnya.reduce((sum, item) => sum + item.jumlahMustahik, 0)}</td>
                <td className="border  px-4 py-2">{totalKeseluruhan.toFixed(2)} kg</td>
                <td className="border  px-4 py-2">100.00%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
