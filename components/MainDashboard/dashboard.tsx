"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Coins, PieChart, BarChart3, FilePlus, FileText } from "lucide-react";
import Link from "next/link";

interface DashboardProps {
  totalMuzakki: number;
  totalKategori: number;
  totalBayarZakat: number;
  totalMustahikWarga: number;
  totalMustahikLainnya: number;
  totalBeras: number;
  totalUang: number;
}

export default function DashboardClient({ totalMuzakki, totalKategori, totalBayarZakat, totalMustahikWarga, totalMustahikLainnya, totalBeras, totalUang }: DashboardProps) {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Aplikasi Zakat Fitrah</h1>

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
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Kategori Mustahik</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalKategori}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Beras Terkumpul</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBeras.toFixed(2)} kg</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Uang Terkumpul</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalUang.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Pengumpulan & Distribusi</CardTitle>
            <CardDescription>Informasi mengenai pengumpulan dan distribusi zakat fitrah</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <FilePlus className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Total Bayar Zakat</p>
                  <p className="text-lg font-bold">{totalBayarZakat}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Mustahik Warga</p>
                  <p className="text-lg font-bold">{totalMustahikWarga}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-indigo-500" />
                <div>
                  <p className="text-sm font-medium">Mustahik Lainnya</p>
                  <p className="text-lg font-bold">{totalMustahikLainnya}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Coins className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Total Mustahik</p>
                  <p className="text-lg font-bold">{totalMustahikWarga + totalMustahikLainnya}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Akses Cepat</CardTitle>
            <CardDescription>Akses cepat ke menu-menu utama aplikasi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/dashboard/muzakki">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Data Muzakki
                </Button>
              </Link>
              <Link href="/dashboard/kategori">
                <Button variant="outline" className="w-full justify-start">
                  <PieChart className="mr-2 h-4 w-4" />
                  Kategori Mustahik
                </Button>
              </Link>
              <Link href="/dashboard/pengumpulan">
                <Button variant="outline" className="w-full justify-start">
                  <FilePlus className="mr-2 h-4 w-4" />
                  Pengumpulan Zakat
                </Button>
              </Link>
              <Link href="/dashboard/distribusi">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Distribusi ke Warga
                </Button>
              </Link>
              <Link href="/dashboard/distribusiLainya">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Distribusi Lainnya
                </Button>
              </Link>
              <Link href="/dashboard/laporan">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Laporan
                </Button>
              </Link>
              <Link href="/dashboard/laporanDistribusi">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Laporan Distribusi
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
