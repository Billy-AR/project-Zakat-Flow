"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormContainer from "@/components/Form/FormContainer";
import FormInput from "@/components/Form/FormInput";
import { createMustahikLainnyaAction, updateMustahikLainnyaAction, deleteMustahikLainnyaAction } from "@/utils/actions";
import type { MustahikLainnya, KategoriMustahik } from "@/lib/types";
import { formatTanggal } from "@/lib/date";

// Tipe untuk MustahikLainnya dengan relasi
type MustahikLainnyaWithRelations = MustahikLainnya & {
  kategori: KategoriMustahik;
};

interface MustahikLainnyaPageProps {
  mustahikLainnyaList: MustahikLainnyaWithRelations[];
  kategoriList: KategoriMustahik[];
}

export default function MustahikLainnyaClient({ mustahikLainnyaList, kategoriList }: MustahikLainnyaPageProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedMustahik, setSelectedMustahik] = useState<MustahikLainnyaWithRelations | null>(null);

  // State untuk form add
  const [selectedKategoriId, setSelectedKategoriId] = useState<string>("");
  const [jumlahHak, setJumlahHak] = useState<string>("0");

  // State untuk form edit
  const [editSelectedKategoriId, setEditSelectedKategoriId] = useState<string>("");
  const [editJumlahHak, setEditJumlahHak] = useState<string>("0");

  // Update jumlah hak ketika kategori dipilih (form add)
  useEffect(() => {
    if (selectedKategoriId) {
      const kategori = kategoriList.find((k) => k.id === selectedKategoriId);
      if (kategori) {
        setJumlahHak(kategori.jumlah_hak.toString());
      }
    }
  }, [selectedKategoriId, kategoriList]);

  // Update jumlah hak ketika kategori dipilih (form edit)
  useEffect(() => {
    if (editSelectedKategoriId) {
      const kategori = kategoriList.find((k) => k.id === editSelectedKategoriId);
      if (kategori) {
        setEditJumlahHak(kategori.jumlah_hak.toString());
      }
    }
  }, [editSelectedKategoriId, kategoriList]);

  const handleEditClick = (mustahik: MustahikLainnyaWithRelations) => {
    setSelectedMustahik(mustahik);
    setEditSelectedKategoriId(mustahik.kategoriId);
    setEditJumlahHak(mustahik.hak.toString());
    setIsEditOpen(true);
  };

  const handleDeleteClick = (mustahik: MustahikLainnyaWithRelations) => {
    setSelectedMustahik(mustahik);
    setIsDeleteOpen(true);
  };

  const handleDetailClick = (mustahik: MustahikLainnyaWithRelations) => {
    setSelectedMustahik(mustahik);
    setIsDetailOpen(true);
  };

  const handleAddOpenChange = (open: boolean) => {
    setIsAddOpen(open);
    if (!open) {
      setSelectedKategoriId("");
      setJumlahHak("0");
    }
  };

  const handleEditOpenChange = (open: boolean) => {
    setIsEditOpen(open);
    if (!open) {
      setEditSelectedKategoriId("");
      setEditJumlahHak("0");
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Distribusi Zakat Fitrah Mustahik Lainnya</h1>
        <Dialog open={isAddOpen} onOpenChange={handleAddOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Mustahik Lainnya
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Tambah Mustahik Lainnya</DialogTitle>
              <DialogDescription>Isi formulir berikut untuk menambahkan data mustahik lainnya.</DialogDescription>
            </DialogHeader>
            <FormContainer action={createMustahikLainnyaAction} submitBtn>
              <div className="space-y-4 py-4">
                <FormInput type="text" name="nama" label="Nama Mustahik" placeholder="Masukkan nama mustahik" required />

                <div>
                  <Label htmlFor="kategoriId">Kategori Mustahik</Label>
                  <Select name="kategoriId" value={selectedKategoriId} onValueChange={setSelectedKategoriId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori mustahik" />
                    </SelectTrigger>
                    <SelectContent>
                      {kategoriList.map((kategori) => (
                        <SelectItem key={kategori.id} value={kategori.id}>
                          {kategori.nama_kategori} ({kategori.jumlah_hak} kg)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="hak">Jumlah Hak (kg)</Label>
                  <Input type="number" name="hak" value={jumlahHak} step="0.1" readOnly />
                  <p className="text-sm text-muted-foreground mt-1">Otomatis terisi sesuai kategori yang dipilih</p>
                </div>
              </div>
            </FormContainer>
          </DialogContent>
        </Dialog>
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mustahikLainnyaList.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">Belum ada data mustahik lainnya</p>
          </div>
        ) : (
          mustahikLainnyaList.map((mustahik) => (
            <Card key={mustahik.id}>
              <CardHeader>
                <CardTitle>{mustahik.nama}</CardTitle>
                <CardDescription>Kategori: {mustahik.kategori.nama_kategori}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Jumlah Hak:</span> {mustahik.hak} kg
                  </p>
                  <p className="text-xs text-muted-foreground">{formatTanggal(mustahik.createdAt)}</p>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleDetailClick(mustahik)}>
                    <Eye className="h-4 w-4 mr-1" />
                    Detail
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(mustahik)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(mustahik)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Hapus
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={handleEditOpenChange}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Mustahik Lainnya</DialogTitle>
            <DialogDescription>Ubah informasi mustahik lainnya.</DialogDescription>
          </DialogHeader>
          {selectedMustahik && (
            <FormContainer action={updateMustahikLainnyaAction} submitBtn>
              <input type="hidden" name="id" value={selectedMustahik.id} />
              <div className="space-y-4 py-4">
                <FormInput type="text" name="nama" label="Nama Mustahik" placeholder="Masukkan nama mustahik" required defaultValue={selectedMustahik.nama} />

                <div>
                  <Label htmlFor="kategoriId">Kategori Mustahik</Label>
                  <Select name="kategoriId" value={editSelectedKategoriId} onValueChange={setEditSelectedKategoriId}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {kategoriList.map((kategori) => (
                        <SelectItem key={kategori.id} value={kategori.id}>
                          {kategori.nama_kategori} ({kategori.jumlah_hak} kg)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="hak">Jumlah Hak (kg)</Label>
                  <Input type="number" name="hak" value={editJumlahHak} step="0.1" readOnly />
                  <p className="text-sm text-muted-foreground mt-1">Otomatis terisi sesuai kategori yang dipilih</p>
                </div>
              </div>
            </FormContainer>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hapus Mustahik Lainnya</DialogTitle>
            <DialogDescription>Apakah Anda yakin ingin menghapus data mustahik lainnya ini?</DialogDescription>
          </DialogHeader>
          {selectedMustahik && (
            <div className="py-4">
              <p className="mb-4">
                Anda akan menghapus mustahik lainnya: <strong>{selectedMustahik.nama}</strong>
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                  Batal
                </Button>
                <FormContainer action={deleteMustahikLainnyaAction} iconBtn={<Button variant="destructive">Hapus</Button>}>
                  <input type="hidden" name="id" value={selectedMustahik.id} />
                </FormContainer>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detail Mustahik Lainnya</DialogTitle>
          </DialogHeader>
          {selectedMustahik && (
            <div className="space-y-4 py-4">
              <div>
                <h4 className="text-sm font-medium">Nama Mustahik</h4>
                <p className="text-sm">{selectedMustahik.nama}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Kategori</h4>
                <p className="text-sm">{selectedMustahik.kategori.nama_kategori}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Jumlah Hak</h4>
                <p className="text-sm">{selectedMustahik.hak} kg</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Tanggal Distribusi</h4>
                <p className="text-sm">{formatTanggal(selectedMustahik.createdAt)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Terakhir Diperbarui</h4>
                <p className="text-sm">{new Date(selectedMustahik.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
