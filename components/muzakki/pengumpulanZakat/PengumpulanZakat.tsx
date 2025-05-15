"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import FormContainer from "@/components/Form/FormContainer";
import { createBayarZakatAction, updateBayarZakatAction, deleteBayarZakatAction } from "@/utils/actions";
import { BayarZakat, Muzakki } from "@prisma/client";
import { formatTanggal } from "@/lib/date";

interface BayarZakatProps {
  bayarZakatList: (BayarZakat & { muzakki: Muzakki })[];
  muzakkiList: Muzakki[];
}

export default function BayarZakatClient({ bayarZakatList, muzakkiList }: BayarZakatProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedBayarZakat, setSelectedBayarZakat] = useState<(BayarZakat & { muzakki: Muzakki }) | null>(null);

  // State untuk form add
  const [selectedMuzakki, setSelectedMuzakki] = useState<string>("");
  const [jenisBayar, setJenisBayar] = useState<string>("");
  const [jumlahTanggunganDibayar, setJumlahTanggunganDibayar] = useState<number>(0);
  const [jumlahTanggunganMuzakki, setJumlahTanggunganMuzakki] = useState<number>(0);
  const [bayarBeras, setBayarBeras] = useState<number>(0);
  const [bayarUang, setBayarUang] = useState<number>(0);

  // State untuk form edit
  const [editSelectedMuzakki, setEditSelectedMuzakki] = useState<string>("");
  const [editJenisBayar, setEditJenisBayar] = useState<string>("");
  const [editJumlahTanggunganDibayar, setEditJumlahTanggunganDibayar] = useState<number>(0);
  const [editJumlahTanggunganMuzakki, setEditJumlahTanggunganMuzakki] = useState<number>(0);
  const [editBayarBeras, setEditBayarBeras] = useState<number>(0);
  const [editBayarUang, setEditBayarUang] = useState<number>(0);

  // Konstanta untuk perhitungan
  const BERAS_PER_ORANG = 2.5; // kg
  const UANG_PER_ORANG = 35000; // rupiah

  // Update jumlah tanggungan ketika muzakki dipilih (form add)
  useEffect(() => {
    if (selectedMuzakki) {
      const muzakki = muzakkiList.find((m) => m.id === selectedMuzakki);
      if (muzakki) {
        setJumlahTanggunganMuzakki(muzakki.jumlah_tanggungan);
      }
    }
  }, [selectedMuzakki, muzakkiList]);

  // Update jumlah tanggungan ketika muzakki dipilih (form edit)
  useEffect(() => {
    if (editSelectedMuzakki) {
      const muzakki = muzakkiList.find((m) => m.id === editSelectedMuzakki);
      if (muzakki) {
        setEditJumlahTanggunganMuzakki(muzakki.jumlah_tanggungan);
      }
    }
  }, [editSelectedMuzakki, muzakkiList]);

  // Hitung otomatis jumlah beras/uang (form add)
  useEffect(() => {
    if (jenisBayar === "BERAS") {
      setBayarBeras(jumlahTanggunganDibayar * BERAS_PER_ORANG);
      setBayarUang(0);
    } else if (jenisBayar === "UANG") {
      setBayarUang(jumlahTanggunganDibayar * UANG_PER_ORANG);
      setBayarBeras(0);
    }
  }, [jenisBayar, jumlahTanggunganDibayar]);

  // Hitung otomatis jumlah beras/uang (form edit)
  useEffect(() => {
    if (editJenisBayar === "BERAS") {
      setEditBayarBeras(editJumlahTanggunganDibayar * BERAS_PER_ORANG);
      setEditBayarUang(0);
    } else if (editJenisBayar === "UANG") {
      setEditBayarUang(editJumlahTanggunganDibayar * UANG_PER_ORANG);
      setEditBayarBeras(0);
    }
  }, [editJenisBayar, editJumlahTanggunganDibayar]);

  const resetForm = () => {
    setSelectedMuzakki("");
    setJenisBayar("");
    setJumlahTanggunganDibayar(0);
    setJumlahTanggunganMuzakki(0);
    setBayarBeras(0);
    setBayarUang(0);
  };

  const resetEditForm = () => {
    setEditSelectedMuzakki("");
    setEditJenisBayar("");
    setEditJumlahTanggunganDibayar(0);
    setEditJumlahTanggunganMuzakki(0);
    setEditBayarBeras(0);
    setEditBayarUang(0);
  };

  const handleEditClick = (bayarZakat: BayarZakat & { muzakki: Muzakki }) => {
    setSelectedBayarZakat(bayarZakat);
    setEditSelectedMuzakki(bayarZakat.muzakkiId);
    setEditJenisBayar(bayarZakat.jenis_bayar);
    setEditJumlahTanggunganDibayar(bayarZakat.jumlah_tanggunganYangDibayar);
    setEditJumlahTanggunganMuzakki(bayarZakat.jumlah_tanggungan);
    setEditBayarBeras(bayarZakat.bayar_beras || 0);
    setEditBayarUang(bayarZakat.bayar_uang || 0);
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

  const handleAddOpenChange = (open: boolean) => {
    setIsAddOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleEditOpenChange = (open: boolean) => {
    setIsEditOpen(open);
    if (!open) {
      resetEditForm();
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pengumpulan Zakat</h1>
        <Dialog open={isAddOpen} onOpenChange={handleAddOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Pembayaran
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah Pembayaran Zakat</DialogTitle>
              <DialogDescription>Isi formulir berikut untuk menambahkan pembayaran zakat.</DialogDescription>
            </DialogHeader>
            <FormContainer action={createBayarZakatAction} submitBtn>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="muzakkiId">Pilih Muzakki</Label>
                  <Select name="muzakkiId" value={selectedMuzakki} onValueChange={setSelectedMuzakki}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih muzakki" />
                    </SelectTrigger>
                    <SelectContent>
                      {muzakkiList.map((muzakki) => (
                        <SelectItem key={muzakki.id} value={muzakki.id}>
                          {muzakki.nama_muzakki} ({muzakki.jumlah_tanggungan} tanggungan)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Jumlah Tanggungan</Label>
                  <Input value={jumlahTanggunganMuzakki} disabled />
                </div>

                <div>
                  <Label>Jenis Pembayaran</Label>
                  <RadioGroup name="jenis_bayar" value={jenisBayar} onValueChange={setJenisBayar}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="BERAS" id="beras" />
                      <Label htmlFor="beras">Beras</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="UANG" id="uang" />
                      <Label htmlFor="uang">Uang</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="jumlah_tanggunganYangDibayar">Jumlah Tanggungan yang Dibayar</Label>
                  <Input type="number" name="jumlah_tanggunganYangDibayar" value={jumlahTanggunganDibayar} onChange={(e) => setJumlahTanggunganDibayar(Number(e.target.value))} min={1} max={jumlahTanggunganMuzakki} />
                </div>

                {jenisBayar === "BERAS" && (
                  <div>
                    <Label htmlFor="bayar_beras">Jumlah Beras (kg)</Label>
                    <Input type="number" name="bayar_beras" value={bayarBeras} step="0.1" readOnly />
                    <p className="text-sm text-muted-foreground mt-1">
                      Dihitung otomatis: {jumlahTanggunganDibayar} × {BERAS_PER_ORANG} kg
                    </p>
                  </div>
                )}

                {jenisBayar === "UANG" && (
                  <div>
                    <Label htmlFor="bayar_uang">Jumlah Uang (Rp)</Label>
                    <Input type="number" name="bayar_uang" value={bayarUang} readOnly />
                    <p className="text-sm text-muted-foreground mt-1">
                      Dihitung otomatis: {jumlahTanggunganDibayar} × Rp {UANG_PER_ORANG.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </FormContainer>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bayarZakatList.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">Belum ada data pembayaran zakat</p>
          </div>
        ) : (
          bayarZakatList.map((bayarZakat) => (
            <Card key={bayarZakat.id}>
              <CardHeader>
                <CardTitle>{bayarZakat.muzakki.nama_muzakki}</CardTitle>
                <CardDescription>
                  {bayarZakat.jenis_bayar} - {bayarZakat.jumlah_tanggunganYangDibayar}/{bayarZakat.jumlah_tanggungan} tanggungan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p className="text-sm">
                    <span className="font-medium">Jumlah:</span> {bayarZakat.jenis_bayar === "BERAS" ? `${bayarZakat.bayar_beras} kg beras` : `Rp ${bayarZakat.bayar_uang?.toLocaleString()}`}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatTanggal(bayarZakat.createdAt)}</p>
                </div>
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
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={handleEditOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Pembayaran Zakat</DialogTitle>
            <DialogDescription>Ubah informasi pembayaran zakat.</DialogDescription>
          </DialogHeader>
          {selectedBayarZakat && (
            <FormContainer action={updateBayarZakatAction} submitBtn>
              <input type="hidden" name="id" value={selectedBayarZakat.id} />
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="muzakkiId">Pilih Muzakki</Label>
                  <Select name="muzakkiId" value={editSelectedMuzakki} onValueChange={setEditSelectedMuzakki}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {muzakkiList.map((muzakki) => (
                        <SelectItem key={muzakki.id} value={muzakki.id}>
                          {muzakki.nama_muzakki} ({muzakki.jumlah_tanggungan} tanggungan)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Jumlah Tanggungan</Label>
                  <Input value={editJumlahTanggunganMuzakki} disabled />
                </div>

                <div>
                  <Label>Jenis Pembayaran</Label>
                  <RadioGroup name="jenis_bayar" value={editJenisBayar} onValueChange={setEditJenisBayar}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="BERAS" id="edit-beras" />
                      <Label htmlFor="edit-beras">Beras</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="UANG" id="edit-uang" />
                      <Label htmlFor="edit-uang">Uang</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="jumlah_tanggunganYangDibayar">Jumlah Tanggungan yang Dibayar</Label>
                  <Input type="number" name="jumlah_tanggunganYangDibayar" value={editJumlahTanggunganDibayar} onChange={(e) => setEditJumlahTanggunganDibayar(Number(e.target.value))} min={1} max={editJumlahTanggunganMuzakki} />
                </div>

                {editJenisBayar === "BERAS" && (
                  <div>
                    <Label htmlFor="bayar_beras">Jumlah Beras (kg)</Label>
                    <Input type="number" name="bayar_beras" value={editBayarBeras} step="0.1" readOnly />
                    <p className="text-sm text-muted-foreground mt-1">
                      Dihitung otomatis: {editJumlahTanggunganDibayar} × {BERAS_PER_ORANG} kg
                    </p>
                  </div>
                )}

                {editJenisBayar === "UANG" && (
                  <div>
                    <Label htmlFor="bayar_uang">Jumlah Uang (Rp)</Label>
                    <Input type="number" name="bayar_uang" value={editBayarUang} readOnly />
                    <p className="text-sm text-muted-foreground mt-1">
                      Dihitung otomatis: {editJumlahTanggunganDibayar} × Rp {UANG_PER_ORANG.toLocaleString()}
                    </p>
                  </div>
                )}
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
                Anda akan menghapus pembayaran zakat dari: <strong>{selectedBayarZakat.muzakki.nama_muzakki}</strong>
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
                <h4 className="text-sm font-medium">Nama Muzakki</h4>
                <p className="text-sm">{selectedBayarZakat.muzakki.nama_muzakki}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Nama Kepala Keluarga</h4>
                <p className="text-sm">{selectedBayarZakat.nama_KK}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Jumlah Tanggungan Total</h4>
                <p className="text-sm">{selectedBayarZakat.jumlah_tanggungan}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Jumlah Tanggungan yang Dibayar</h4>
                <p className="text-sm">{selectedBayarZakat.jumlah_tanggunganYangDibayar}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Jenis Pembayaran</h4>
                <p className="text-sm">{selectedBayarZakat.jenis_bayar}</p>
              </div>
              {selectedBayarZakat.jenis_bayar === "BERAS" && (
                <div>
                  <h4 className="text-sm font-medium">Jumlah Beras</h4>
                  <p className="text-sm">{selectedBayarZakat.bayar_beras} kg</p>
                </div>
              )}
              {selectedBayarZakat.jenis_bayar === "UANG" && (
                <div>
                  <h4 className="text-sm font-medium">Jumlah Uang</h4>
                  <p className="text-sm">Rp {selectedBayarZakat.bayar_uang?.toLocaleString()}</p>
                </div>
              )}
              <div>
                <h4 className="text-sm font-medium">Tanggal Pembayaran</h4>
                <p className="text-sm">{formatTanggal(selectedBayarZakat.createdAt)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Terakhir Diperbarui</h4>
                <p className="text-sm">{formatTanggal(selectedBayarZakat.updatedAt)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
