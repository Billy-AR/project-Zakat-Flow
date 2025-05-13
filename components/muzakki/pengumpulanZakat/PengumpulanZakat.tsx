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
import { createBayarZakatAction, updateBayarZakatAction, deleteBayarZakatAction } from "@/utils/actions";
import { BayarZakat, Muzakki } from "@/lib/types";

interface BayarZakatPageProps {
  bayarZakatList: (BayarZakat & {
    muzakki: Muzakki;
  })[];
  muzakkiList: Muzakki[];
}

export default function BayarZakatClient({ bayarZakatList, muzakkiList }: BayarZakatPageProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedBayarZakat, setSelectedBayarZakat] = useState<
    | (BayarZakat & {
        muzakki: Muzakki;
      })
    | null
  >(null);

  const handleEditClick = (bayarZakat: BayarZakat & { muzakki: Muzakki }) => {
    setSelectedBayarZakat(bayarZakat);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (bayarZakat: BayarZakat & { muzakki: Muzakki }) => {
    setSelectedBayarZakat(bayarZakat);
    setIsDeleteOpen(true);
  };

  const handleDetailClick = (bayarZakat: BayarZakat & { muzakki: Muzakki }) => {
    setSelectedBayarZakat(bayarZakat);
    setIsDetailOpen(true);
  };

  const jenisBayarOptions = [
    { labelItem: "Beras", valueItem: "BERAS" },
    { labelItem: "Uang", valueItem: "UANG" },
  ];

  const muzakkiOptions = muzakkiList.map((muzakki) => ({
    labelItem: muzakki.nama_muzakki,
    valueItem: muzakki.id,
  }));

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pengumpulan Zakat Fitrah</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Pembayaran
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Tambah Pembayaran Zakat</DialogTitle>
              <DialogDescription>Isi formulir berikut untuk mencatat pembayaran zakat.</DialogDescription>
            </DialogHeader>
            <FormContainer
              action={async (prev, formData) => {
                // Memperbaiki: Menghapus parameter string kosong
                const res = await createBayarZakatAction(prev, formData);
                if (res.statusMessage === "success") {
                  setIsAddOpen(false);
                }
                return res;
              }}
              submitBtn
            >
              <div className="space-y-4 py-4">
                <FormSelect name="muzakkiId" label="Pilih Muzakki" placeholder="Pilih muzakki yang membayar zakat" selectLabel="Muzakki" items={muzakkiOptions} required />

                <FormInput type="text" name="nama_KK" label="Nama Kepala Keluarga" placeholder="Masukkan nama kepala keluarga" required />

                <FormNumber name="jumlah_tanggungan" label="Jumlah Tanggungan" placeholder="Masukkan jumlah tanggungan" required min={1} />

                <FormSelect name="jenis_bayar" label="Jenis Pembayaran" placeholder="Pilih jenis pembayaran" selectLabel="Jenis Bayar" items={jenisBayarOptions} defaultValue="BERAS" required />

                <FormNumber name="jumlah_tanggunganYangDibayar" label="Jumlah Tanggungan yang Dibayar" placeholder="Masukkan jumlah tanggungan yang dibayar" required min={1} />

                <FormNumber name="bayar_beras" label="Jumlah Beras (kg)" placeholder="Masukkan jumlah beras (kg)" min={0} step={0.1} />

                <FormNumber name="bayar_uang" label="Jumlah Uang (Rp)" placeholder="Masukkan jumlah uang (Rp)" min={0} />
              </div>
            </FormContainer>
          </DialogContent>
        </Dialog>
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bayarZakatList.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">Belum ada data pembayaran zakat</p>
          </div>
        ) : (
          bayarZakatList.map((bayarZakat) => (
            <Card key={bayarZakat.id}>
              <CardHeader>
                <CardTitle>{bayarZakat.nama_KK}</CardTitle>
                <CardDescription>Muzakki: {bayarZakat.muzakki.nama_muzakki}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Jenis Bayar:</span> {bayarZakat.jenis_bayar === "BERAS" ? "Beras" : "Uang"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Jumlah Tanggungan:</span> {bayarZakat.jumlah_tanggungan}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Jumlah Tanggungan Dibayar:</span> {bayarZakat.jumlah_tanggunganYangDibayar}
                  </p>
                  {bayarZakat.jenis_bayar === "BERAS" && bayarZakat.bayar_beras && (
                    <p className="text-sm">
                      <span className="font-medium">Jumlah Beras:</span> {bayarZakat.bayar_beras} kg
                    </p>
                  )}
                  {bayarZakat.jenis_bayar === "UANG" && bayarZakat.bayar_uang && (
                    <p className="text-sm">
                      <span className="font-medium">Jumlah Uang:</span> Rp {bayarZakat.bayar_uang.toLocaleString()}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleDetailClick(bayarZakat)}>
                    <Eye className="h-4 w-4 mr-1" />
                    Detail
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(bayarZakat)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(bayarZakat)}>
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
            <DialogTitle>Edit Pembayaran Zakat</DialogTitle>
            <DialogDescription>Ubah informasi pembayaran zakat.</DialogDescription>
          </DialogHeader>
          {selectedBayarZakat && (
            <FormContainer action={updateBayarZakatAction} submitBtn>
              <input type="hidden" name="id" value={selectedBayarZakat.id} />
              <div className="space-y-4 py-4">
                <FormSelect name="muzakkiId" label="Pilih Muzakki" placeholder="Pilih muzakki yang membayar zakat" selectLabel="Muzakki" items={muzakkiOptions} required defaultValue={selectedBayarZakat.muzakkiId} />

                <FormInput type="text" name="nama_KK" label="Nama Kepala Keluarga" placeholder="Masukkan nama kepala keluarga" required defaultValue={selectedBayarZakat.nama_KK} />

                <FormNumber name="jumlah_tanggungan" label="Jumlah Tanggungan" placeholder="Masukkan jumlah tanggungan" required min={1} defaultValue={selectedBayarZakat.jumlah_tanggungan} />

                <FormSelect name="jenis_bayar" label="Jenis Pembayaran" placeholder="Pilih jenis pembayaran" selectLabel="Jenis Bayar" items={jenisBayarOptions} defaultValue={selectedBayarZakat.jenis_bayar} required />

                <FormNumber name="jumlah_tanggunganYangDibayar" label="Jumlah Tanggungan yang Dibayar" placeholder="Masukkan jumlah tanggungan yang dibayar" required min={1} defaultValue={selectedBayarZakat.jumlah_tanggunganYangDibayar} />

                <FormNumber name="bayar_beras" label="Jumlah Beras (kg)" placeholder="Masukkan jumlah beras (kg)" min={0} step={0.1} defaultValue={selectedBayarZakat.bayar_beras || undefined} />

                <FormNumber name="bayar_uang" label="Jumlah Uang (Rp)" placeholder="Masukkan jumlah uang (Rp)" min={0} defaultValue={selectedBayarZakat.bayar_uang || undefined} />
              </div>
            </FormContainer>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hapus Pembayaran Zakat</DialogTitle>
            <DialogDescription>Apakah Anda yakin ingin menghapus data pembayaran zakat ini?</DialogDescription>
          </DialogHeader>
          {selectedBayarZakat && (
            <div className="py-4">
              <p className="mb-4">
                Anda akan menghapus pembayaran zakat dari: <strong>{selectedBayarZakat.nama_KK}</strong>
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                  Batal
                </Button>
                <FormContainer action={deleteBayarZakatAction} iconBtn={<Button variant="destructive">Hapus</Button>}>
                  <input type="hidden" name="id" value={selectedBayarZakat.id} />
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
            <DialogTitle>Detail Pembayaran Zakat</DialogTitle>
          </DialogHeader>
          {selectedBayarZakat && (
            <div className="space-y-4 py-4">
              <div>
                <h4 className="text-sm font-medium">Muzakki</h4>
                <p className="text-sm">{selectedBayarZakat.muzakki.nama_muzakki}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Nama KK</h4>
                <p className="text-sm">{selectedBayarZakat.nama_KK}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Jumlah Tanggungan</h4>
                <p className="text-sm">{selectedBayarZakat.jumlah_tanggungan}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Jenis Pembayaran</h4>
                <p className="text-sm">{selectedBayarZakat.jenis_bayar === "BERAS" ? "Beras" : "Uang"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Jumlah Tanggungan yang Dibayar</h4>
                <p className="text-sm">{selectedBayarZakat.jumlah_tanggunganYangDibayar}</p>
              </div>
              {selectedBayarZakat.jenis_bayar === "BERAS" && selectedBayarZakat.bayar_beras && (
                <div>
                  <h4 className="text-sm font-medium">Jumlah Beras</h4>
                  <p className="text-sm">{selectedBayarZakat.bayar_beras} kg</p>
                </div>
              )}
              {selectedBayarZakat.jenis_bayar === "UANG" && selectedBayarZakat.bayar_uang && (
                <div>
                  <h4 className="text-sm font-medium">Jumlah Uang</h4>
                  <p className="text-sm">Rp {selectedBayarZakat.bayar_uang.toLocaleString()}</p>
                </div>
              )}
              <div>
                <h4 className="text-sm font-medium">Tanggal Pembayaran</h4>
                <p className="text-sm">{new Date(selectedBayarZakat.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Terakhir Diperbarui</h4>
                <p className="text-sm">{new Date(selectedBayarZakat.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
