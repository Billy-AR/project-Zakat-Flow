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
import TextAreaInput from "@/components/Form/TextAreaInput";
import { createMuzakkiAction, updateMuzakkiAction, deleteMuzakkiAction } from "@/utils/actions";
import { Muzakki } from "@prisma/client";

interface MuzakkiPageProps {
  muzakkiList: Muzakki[];
}

export default function MuzakkiPage({ muzakkiList }: MuzakkiPageProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedMuzakki, setSelectedMuzakki] = useState<Muzakki | null>(null);

  const handleEditClick = (muzakki: Muzakki) => {
    setSelectedMuzakki(muzakki);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (muzakki: Muzakki) => {
    setSelectedMuzakki(muzakki);
    setIsDeleteOpen(true);
  };

  const handleDetailClick = (muzakki: Muzakki) => {
    setSelectedMuzakki(muzakki);
    setIsDetailOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Data Muzakki</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Muzakki
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah Muzakki</DialogTitle>
              <DialogDescription>Isi formulir berikut untuk menambahkan data muzakki baru.</DialogDescription>
            </DialogHeader>
            <FormContainer action={createMuzakkiAction} submitBtn>
              <div className="space-y-4 py-4">
                <FormInput type="text" name="nama_muzakki" label="Nama Muzakki" placeholder="Masukkan nama muzakki" required />
                <FormNumber name="jumlah_tanggungan" label="Jumlah Tanggungan" placeholder="Masukkan jumlah tanggungan" required min={1} />
                <TextAreaInput name="keterangan" labelText="Keterangan" placeholder="Masukkan keterangan (opsional)" />
              </div>
            </FormContainer>
          </DialogContent>
        </Dialog>
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {muzakkiList.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">Belum ada data muzakki</p>
          </div>
        ) : (
          muzakkiList.map((muzakki) => (
            <Card key={muzakki.id}>
              <CardHeader>
                <CardTitle>{muzakki.nama_muzakki}</CardTitle>
                <CardDescription>Jumlah Tanggungan: {muzakki.jumlah_tanggungan}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{muzakki.keterangan || "Tidak ada keterangan"}</p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleDetailClick(muzakki)}>
                    <Eye className="h-4 w-4 mr-1" />
                    Detail
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(muzakki)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(muzakki)}>
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
            <DialogTitle>Edit Muzakki</DialogTitle>
            <DialogDescription>Ubah informasi muzakki.</DialogDescription>
          </DialogHeader>
          {selectedMuzakki && (
            <FormContainer action={updateMuzakkiAction} submitBtn>
              <input type="hidden" name="id" value={selectedMuzakki.id} />
              <div className="space-y-4 py-4">
                <FormInput type="text" name="nama_muzakki" label="Nama Muzakki" placeholder="Masukkan nama muzakki" required defaultValue={selectedMuzakki.nama_muzakki} />
                <FormNumber name="jumlah_tanggungan" label="Jumlah Tanggungan" placeholder="Masukkan jumlah tanggungan" required min={1} defaultValue={selectedMuzakki.jumlah_tanggungan} />
                <TextAreaInput name="keterangan" labelText="Keterangan" placeholder="Masukkan keterangan (opsional)" defaultValue={selectedMuzakki.keterangan || ""} />
              </div>
            </FormContainer>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hapus Muzakki</DialogTitle>
            <DialogDescription>Apakah Anda yakin ingin menghapus data muzakki ini?</DialogDescription>
          </DialogHeader>
          {selectedMuzakki && (
            <div className="py-4">
              <p className="mb-4">
                Anda akan menghapus muzakki: <strong>{selectedMuzakki.nama_muzakki}</strong>
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                  Batal
                </Button>
                <FormContainer action={deleteMuzakkiAction} iconBtn={<Button variant="destructive">Hapus</Button>}>
                  <input type="hidden" name="id" value={selectedMuzakki.id} />
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
            <DialogTitle>Detail Muzakki</DialogTitle>
          </DialogHeader>
          {selectedMuzakki && (
            <div className="space-y-4 py-4">
              <div>
                <h4 className="text-sm font-medium">Nama Muzakki</h4>
                <p className="text-sm">{selectedMuzakki.nama_muzakki}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Jumlah Tanggungan</h4>
                <p className="text-sm">{selectedMuzakki.jumlah_tanggungan}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Keterangan</h4>
                <p className="text-sm">{selectedMuzakki.keterangan || "Tidak ada keterangan"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Dibuat Pada</h4>
                <p className="text-sm">{new Date(selectedMuzakki.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Diperbarui Pada</h4>
                <p className="text-sm">{new Date(selectedMuzakki.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
