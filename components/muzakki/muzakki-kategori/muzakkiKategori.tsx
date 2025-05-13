"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import FormContainer from "@/components/Form/FormContainer";
import FormInput from "@/components/Form/FormInput";
import FormNumber from "@/components/Form/FormNumber";
import { createKategoriAction, updateKategoriAction, deleteKategoriAction } from "@/utils/actions";
import { KategoriMustahik } from "@/lib/types";

interface KategoriPageProps {
  kategoriList: KategoriMustahik[];
}

export default function MuzakkiKategori({ kategoriList }: KategoriPageProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState<KategoriMustahik | null>(null);

  const handleEditClick = (kategori: KategoriMustahik) => {
    setSelectedKategori(kategori);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (kategori: KategoriMustahik) => {
    setSelectedKategori(kategori);
    setIsDeleteOpen(true);
  };

  const handleDetailClick = (kategori: KategoriMustahik) => {
    setSelectedKategori(kategori);
    setIsDetailOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Data Kategori Mustahik</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Kategori
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah Kategori Mustahik</DialogTitle>
              <DialogDescription>Isi formulir berikut untuk menambahkan kategori mustahik baru.</DialogDescription>
            </DialogHeader>
            <FormContainer action={createKategoriAction} submitBtn>
              <div className="space-y-4 py-4">
                <FormInput type="text" name="nama_kategori" label="Nama Kategori" placeholder="Masukkan nama kategori" required />
                <FormNumber name="jumlah_hak" label="Jumlah Hak (Kg)" placeholder="Masukkan jumlah hak dalam kg" required min={0} step={0.5} />
              </div>
            </FormContainer>
          </DialogContent>
        </Dialog>
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kategoriList.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">Belum ada data kategori mustahik</p>
          </div>
        ) : (
          kategoriList.map((kategori) => (
            <Card key={kategori.id}>
              <CardHeader>
                <CardTitle>{kategori.nama_kategori}</CardTitle>
                <CardDescription>Jumlah Hak: {kategori.jumlah_hak} Kg</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleDetailClick(kategori)}>
                    <Eye className="h-4 w-4 mr-1" />
                    Detail
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(kategori)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(kategori)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Kategori Mustahik</DialogTitle>
            <DialogDescription>Ubah informasi kategori mustahik.</DialogDescription>
          </DialogHeader>
          {selectedKategori && (
            <FormContainer action={updateKategoriAction} submitBtn>
              <input type="hidden" name="id" value={selectedKategori.id} />
              <div className="space-y-4 py-4">
                <FormInput type="text" name="nama_kategori" label="Nama Kategori" placeholder="Masukkan nama kategori" required defaultValue={selectedKategori.nama_kategori} />
                <FormNumber name="jumlah_hak" label="Jumlah Hak (Kg)" placeholder="Masukkan jumlah hak dalam kg" required min={0} step={0.5} defaultValue={selectedKategori.jumlah_hak} />
              </div>
            </FormContainer>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hapus Kategori Mustahik</DialogTitle>
            <DialogDescription>Apakah Anda yakin ingin menghapus kategori mustahik ini?</DialogDescription>
          </DialogHeader>
          {selectedKategori && (
            <div className="py-4">
              <p className="mb-4">
                Anda akan menghapus kategori: <strong>{selectedKategori.nama_kategori}</strong>
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                  Batal
                </Button>
                <FormContainer action={deleteKategoriAction} iconBtn={<Button variant="destructive">Hapus</Button>}>
                  <input type="hidden" name="id" value={selectedKategori.id} />
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
            <DialogTitle>Detail Kategori Mustahik</DialogTitle>
          </DialogHeader>
          {selectedKategori && (
            <div className="space-y-4 py-4">
              <div>
                <h4 className="text-sm font-medium">Nama Kategori</h4>
                <p className="text-sm">{selectedKategori.nama_kategori}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Jumlah Hak (Kg)</h4>
                <p className="text-sm">{selectedKategori.jumlah_hak} Kg</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Dibuat Pada</h4>
                <p className="text-sm">{new Date(selectedKategori.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Diperbarui Pada</h4>
                <p className="text-sm">{new Date(selectedKategori.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
