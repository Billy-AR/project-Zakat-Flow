export type statusMessage = "success" | "error" | "info";

export type actionFunction = (prevState: any, formData: FormData) => Promise<{ message: string; statusMessage: statusMessage }>;

// Muzakki types
export interface Muzakki {
  id: string;
  nama_muzakki: string;
  jumlah_tanggungan: number;
  keterangan?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// KategoriMustahik types
export interface KategoriMustahik {
  id: string;
  nama_kategori: string;
  jumlah_hak: number;
  createdAt: Date;
  updatedAt: Date;
}

// BayarZakat types
export interface BayarZakat {
  id: string;
  muzakkiId: string;
  nama_KK: string;
  jumlah_tanggungan: number;
  jenis_bayar: "BERAS" | "UANG";
  jumlah_tanggunganYangDibayar: number;
  bayar_beras?: number | null;
  bayar_uang?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// MustahikWarga types
export interface MustahikWarga {
  id: string;
  muzakkiId: string;
  nama: string;
  kategoriId: string;
  hak: number;
  createdAt: Date;
  updatedAt: Date;
}

// MustahikLainnya types
export interface MustahikLainnya {
  id: string;
  nama: string;
  kategoriId: string;
  hak: number;
  createdAt: Date;
  updatedAt: Date;
}
