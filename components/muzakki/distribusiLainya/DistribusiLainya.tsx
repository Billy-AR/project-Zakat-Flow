"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import FormContainer from "@/components/Form/FormContainer";
import FormInput from "@/components/Form/FormInput";
import FormNumber from "@/components/Form/FormNumber";
import FormSelect from "@/components/Form/FormSelect";
import { createMustahikLainnyaAction, updateMustahikLainnyaAction, deleteMustahikLainnyaAction } from "@/utils/actions";
import { MustahikLainnya, KategoriMustahik, statusMessage } from "@/lib/types";

interface MustahikLainnyaPageProps {
  mustahikLainnyaList: (MustahikLainnya & {
    kategori: KategoriMustahik;
  })[];
  kategoriList: KategoriMustahik[];
}

export default function MustahikLainnyaClient({ mustahikLainnyaList, kategoriList }: MustahikLainnyaPageProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedMustahik, setSelectedMustahik] = useState<
    | (MustahikLainnya & {
        kategori: KategoriMustahik;
      })
    | null
  >(null);

  const handleEditClick = (mustahik: MustahikLainnya & { kategori: KategoriMustahik }) => {
    setSelectedMustahik(mustahik);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (mustahik: MustahikLainnya & { kategori: KategoriMustahik }) => {
    setSelectedMustahik(mustahik);
    setIsDeleteOpen(true);
  };

  const handleDetailClick = (mustahik: MustahikLainnya & { kategori: KategoriMustahik }) => {
    setSelectedMustahik(mustahik);
    setIsDetailOpen(true);
  };

  const kategoriOptions = kategoriList.map((kategori) => ({
    labelItem: kategori.nama_kategori,
    valueItem: kategori.id,
  }));

  // Function to handle form submission with validation
  const handleFormSubmit = async (_: unknown, formData: FormData): Promise<{ message: string; statusMessage: statusMessage }> => {
    // Ensure form fields have values before submission
    const nama = formData.get("nama");
    const kategoriId = formData.get("kategoriId");
    const hakValue = formData.get("hak");

    // Validate required fields
    if (!nama || !kategoriId || !hakValue) {
      // Don't submit if any required field is missing
      return { message: "Semua field harus diisi dengan benar", statusMessage: "error" };
    }

    // Ensure hak is a valid number
    const hak = parseFloat(hakValue as string);
    if (isNaN(hak)) {
      return { message: "Jumlah hak harus berupa angka", statusMessage: "error" };
    }

    // If validation passes, submit the form
    const result = await createMustahikLainnyaAction("", formData);
    setIsAddOpen(false);
    return result;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Distribusi Zakat Fitrah Mustahik Lainnya</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
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
            <FormContainer action={handleFormSubmit} submitBtn>
              <div className="space-y-4 py-4">
                <FormInput type="text" name="nama" label="Nama Mustahik" placeholder="Masukkan nama mustahik" required />

                <FormSelect name="kategoriId" label="Kategori Mustahik" placeholder="Pilih kategori mustahik" selectLabel="Kategori" items={kategoriOptions} required />

                <FormNumber name="hak" label="Jumlah Hak (Kg)" placeholder="Masukkan jumlah hak dalam kg" required min={0} step={0.1} defaultValue={0} />
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
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
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

                <FormSelect name="kategoriId" label="Kategori Mustahik" placeholder="Pilih kategori mustahik" selectLabel="Kategori" items={kategoriOptions} required defaultValue={selectedMustahik.kategoriId} />

                <FormNumber name="hak" label="Jumlah Hak (Kg)" placeholder="Masukkan jumlah hak dalam kg" required min={0} step={0.1} defaultValue={selectedMustahik.hak} />
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
                <p className="text-sm">{new Date(selectedMustahik.createdAt).toLocaleString()}</p>
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
