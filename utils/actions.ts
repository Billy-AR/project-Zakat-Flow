"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import db from "./db";
import { statusMessage } from "@/lib/types";
import { ZodError } from "zod";

// Schemas for validation
const muzakkiSchema = z.object({
  nama_muzakki: z.string().min(1, "Nama muzakki harus diisi"),
  jumlah_tanggungan: z.coerce.number().min(1, "Jumlah tanggungan minimal 1"),
  keterangan: z.string().optional(),
});

const kategoriSchema = z.object({
  nama_kategori: z.string().min(1, "Nama kategori harus diisi"),
  jumlah_hak: z.coerce.number().min(0, "Jumlah hak tidak boleh negatif"),
});

const bayarZakatSchema = z.object({
  muzakkiId: z.string().min(1, "Muzakki harus dipilih"),
  jenis_bayar: z.enum(["BERAS", "UANG"], {
    required_error: "Jenis bayar harus dipilih",
  }),
  jumlah_tanggunganYangDibayar: z.coerce.number().min(1, "Jumlah tanggungan yang dibayar minimal 1"),
  bayar_beras: z.coerce.number().optional(),
  bayar_uang: z.coerce.number().optional(),
});

const mustahikWargaSchema = z.object({
  muzakkiId: z.string().min(1, "Muzakki harus dipilih"),
  kategoriId: z.string().min(1, "Kategori harus dipilih"),
  hak: z.coerce.number().min(0, "Hak tidak boleh negatif"),
});

const mustahikLainnyaSchema = z.object({
  nama: z.string().min(1, "Nama harus diisi"),
  kategoriId: z.string().min(1, "Kategori harus dipilih"),
  hak: z.coerce.number().min(0, "Hak tidak boleh negatif"),
});

const renderError = (error: unknown): { message: string; statusMessage: statusMessage } => {
  console.log(error);

  return { message: error instanceof Error ? error.message : "An error occurred", statusMessage: "error" };
};

// Helper function to handle form validation

async function validateForm<T>(schema: any, formData: FormData | Record<string, any>) {
  const formObject: Record<string, any> = {};

  // Jika formData punya method entries(), anggap itu FormData
  if (typeof (formData as FormData).entries === "function") {
    for (const [key, value] of (formData as FormData).entries()) {
      formObject[key] = value;
    }
  } else {
    // Kalau plain object, pakai Object.entries
    for (const [key, value] of Object.entries(formData as Record<string, any>)) {
      formObject[key] = value;
    }
  }

  try {
    return {
      success: true,
      data: schema.parse(formObject),
    };
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        success: false,
        error: err.errors.map((e) => e.message).join(", "),
      };
    }
    return {
      success: false,
      error: "Terjadi kesalahan validasi",
    };
  }
}

export async function getMuzakkiList() {
  const muzakkiList = await db.muzakki.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return muzakkiList;
}

// ===== MUZAKKI ACTIONS =====
export async function createMuzakkiAction(_: any, formData: FormData): Promise<{ message: string; statusMessage: statusMessage }> {
  const validation = await validateForm(muzakkiSchema, formData);

  try {
    await db.muzakki.create({
      data: {
        nama_muzakki: validation.data.nama_muzakki,
        jumlah_tanggungan: validation.data.jumlah_tanggungan,
        keterangan: validation.data.keterangan || null,
      },
    });

    revalidatePath("/muzakki");
    return {
      message: "Muzakki berhasil ditambahkan",
      statusMessage: "success",
    };
  } catch (error) {
    return renderError(error);
  }
}

export async function updateMuzakkiAction(_: any, formData: FormData): Promise<{ message: string; statusMessage: statusMessage }> {
  const id = formData.get("id") as string;
  const validation = await validateForm(muzakkiSchema, formData);

  if (!validation.success) {
    return {
      message: validation.error || "Invalid Input",
      statusMessage: "error",
    };
  }

  try {
    await db.muzakki.update({
      where: { id },
      data: {
        nama_muzakki: validation.data.nama_muzakki,
        jumlah_tanggungan: validation.data.jumlah_tanggungan,
        keterangan: validation.data.keterangan || null,
      },
    });

    revalidatePath("/muzakki");
    return {
      message: "Muzakki berhasil diupdate",
      statusMessage: "success",
    };
  } catch (error) {
    return renderError(error);
  }
}

export async function deleteMuzakkiAction(_: any, formData: FormData): Promise<{ message: string; statusMessage: statusMessage }> {
  const id = formData.get("id") as string;

  try {
    await db.muzakki.delete({
      where: { id },
    });

    revalidatePath("/muzakki");
    return {
      message: "Muzakki berhasil dihapus",
      statusMessage: "success",
    };
  } catch (error) {
    return renderError(error);
  }
}

// ===== KATEGORI MUSTAHIK ACTIONS =====

export async function createKategoriAction(_: any, formData: FormData): Promise<{ message: string; statusMessage: statusMessage }> {
  const validation = await validateForm(kategoriSchema, formData);

  if (!validation.success) {
    return {
      message: validation.error || "invalid input",
      statusMessage: "error",
    };
  }

  try {
    await db.kategoriMustahik.create({
      data: {
        nama_kategori: validation.data.nama_kategori,
        jumlah_hak: validation.data.jumlah_hak,
      },
    });

    revalidatePath("/kategori-mustahik");
    return {
      message: "Kategori Mustahik berhasil ditambahkan",
      statusMessage: "success",
    };
  } catch (error) {
    return renderError(error);
  }
}

export async function getMuzakkiKategoriList() {
  const muzakkiList = await db.kategoriMustahik.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return muzakkiList;
}
export async function updateKategoriAction(_: any, formData: FormData): Promise<{ message: string; statusMessage: statusMessage }> {
  const id = formData.get("id") as string;
  const validation = await validateForm(kategoriSchema, formData);

  if (!validation.success) {
    return {
      message: validation.error || "invalid input",
      statusMessage: "error",
    };
  }

  try {
    await db.kategoriMustahik.update({
      where: { id },
      data: {
        nama_kategori: validation.data.nama_kategori,
        jumlah_hak: validation.data.jumlah_hak,
      },
    });

    revalidatePath("/kategori-mustahik");
    return {
      message: "Kategori Mustahik berhasil diupdate",
      statusMessage: "success",
    };
  } catch (error) {
    return renderError(error);
  }
}

export async function deleteKategoriAction(_: any, formData: FormData): Promise<{ message: string; statusMessage: statusMessage }> {
  const id = formData.get("id") as string;

  try {
    await db.kategoriMustahik.delete({
      where: { id },
    });

    revalidatePath("/kategori-mustahik");
    return {
      message: "Kategori Mustahik berhasil dihapus",
      statusMessage: "success",
    };
  } catch (error) {
    return renderError(error);
  }
}

// ===== BAYAR ZAKAT ACTIONS =====
export async function createBayarZakatAction(_: any, formData: FormData): Promise<{ message: string; statusMessage: statusMessage }> {
  const validation = await validateForm(bayarZakatSchema, formData);

  if (!validation.success) {
    return {
      message: validation.error || "Invalid input",
      statusMessage: "error",
    };
  }

  try {
    // Ambil data muzakki untuk mendapatkan nama dan jumlah tanggungan
    const muzakki = await db.muzakki.findUnique({
      where: { id: validation.data.muzakkiId },
    });

    if (!muzakki) {
      return {
        message: "Muzakki tidak ditemukan",
        statusMessage: "error",
      };
    }

    const jenisBayar = validation.data.jenis_bayar;

    await db.bayarZakat.create({
      data: {
        muzakkiId: validation.data.muzakkiId,
        nama_KK: muzakki.nama_muzakki, // Otomatis dari nama muzakki
        jumlah_tanggungan: muzakki.jumlah_tanggungan, // Otomatis dari data muzakki
        jenis_bayar: jenisBayar,
        jumlah_tanggunganYangDibayar: validation.data.jumlah_tanggunganYangDibayar,
        bayar_beras: jenisBayar === "BERAS" ? validation.data.bayar_beras : null,
        bayar_uang: jenisBayar === "UANG" ? validation.data.bayar_uang : null,
      },
    });

    revalidatePath("/dashboard/pengumpulan");
    return {
      message: "Pembayaran zakat berhasil ditambahkan",
      statusMessage: "success",
    };
  } catch (error) {
    return renderError(error);
  }
}

export async function getBayarZakatList() {
  const bayarZakatList = await db.bayarZakat.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      muzakki: true,
    },
  });
  return bayarZakatList;
}

export async function getMuzakkiNameList() {
  // Fetch all muzakki for the select input
  const muzakkiList = await db.muzakki.findMany({
    orderBy: {
      nama_muzakki: "asc",
    },
  });
  return muzakkiList;
}

// Update updateBayarZakatAction dengan logika yang sama
export async function updateBayarZakatAction(_: any, formData: FormData): Promise<{ message: string; statusMessage: statusMessage }> {
  const id = formData.get("id") as string;
  const validation = await validateForm(bayarZakatSchema, formData);

  if (!validation.success) {
    return {
      message: validation.error || "invalid input",
      statusMessage: "error",
    };
  }

  try {
    // Ambil data muzakki untuk mendapatkan nama dan jumlah tanggungan
    const muzakki = await db.muzakki.findUnique({
      where: { id: validation.data.muzakkiId },
    });

    if (!muzakki) {
      return {
        message: "Muzakki tidak ditemukan",
        statusMessage: "error",
      };
    }

    const jenisBayar = validation.data.jenis_bayar;

    await db.bayarZakat.update({
      where: { id },
      data: {
        muzakkiId: validation.data.muzakkiId,
        nama_KK: muzakki.nama_muzakki, // Otomatis dari nama muzakki
        jumlah_tanggungan: muzakki.jumlah_tanggungan, // Otomatis dari data muzakki
        jenis_bayar: jenisBayar,
        jumlah_tanggunganYangDibayar: validation.data.jumlah_tanggunganYangDibayar,
        bayar_beras: jenisBayar === "BERAS" ? validation.data.bayar_beras : null,
        bayar_uang: jenisBayar === "UANG" ? validation.data.bayar_uang : null,
      },
    });

    revalidatePath("/pengumpulan-zakat");
    return {
      message: "Pembayaran zakat berhasil diupdate",
      statusMessage: "success",
    };
  } catch (error) {
    return renderError(error);
  }
}

export async function deleteBayarZakatAction(_: any, formData: FormData): Promise<{ message: string; statusMessage: statusMessage }> {
  const id = formData.get("id") as string;

  try {
    await db.bayarZakat.delete({
      where: { id },
    });

    revalidatePath("/pengumpulan-zakat");
    return {
      message: "Pembayaran zakat berhasil dihapus",
      statusMessage: "success",
    };
  } catch (error) {
    return renderError(error);
  }
}
// ===== MUSTAHIK WARGA ACTIONS =====
// Update createMustahikWargaAction
export async function createMustahikWargaAction(_: any, formData: FormData): Promise<{ message: string; statusMessage: statusMessage }> {
  const validation = await validateForm(mustahikWargaSchema, formData);

  if (!validation.success) {
    return {
      message: validation.error || "Invalid input",
      statusMessage: "error",
    };
  }

  try {
    // Ambil data muzakki untuk mendapatkan nama
    const muzakki = await db.muzakki.findUnique({
      where: { id: validation.data.muzakkiId },
    });

    if (!muzakki) {
      return {
        message: "Muzakki tidak ditemukan",
        statusMessage: "error",
      };
    }

    await db.mustahikWarga.create({
      data: {
        muzakkiId: validation.data.muzakkiId,
        nama: muzakki.nama_muzakki, // Otomatis dari nama muzakki
        kategoriId: validation.data.kategoriId,
        hak: validation.data.hak,
      },
    });

    revalidatePath("/distribusi-zakat-warga");
    return {
      message: "Mustahik warga berhasil ditambahkan",
      statusMessage: "success",
    };
  } catch (error) {
    return renderError(error);
  }
}

export async function getMustahikWargaList() {
  // Fetch mustahik warga data with related muzakki and kategori
  const mustahikWargaList = await db.mustahikWarga.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      muzakki: true,
      kategori: true,
    },
  });

  return mustahikWargaList;
}

export async function getKategoriListAsc() {
  // Fetch all kategori mustahik for the select input
  const kategoriList = await db.kategoriMustahik.findMany({
    orderBy: {
      nama_kategori: "asc",
    },
  });

  return kategoriList;
}

export async function updateMustahikWargaAction(_: any, formData: FormData): Promise<{ message: string; statusMessage: statusMessage }> {
  const id = formData.get("id") as string;
  const validation = await validateForm(mustahikWargaSchema, formData);

  if (!validation.success) {
    return {
      message: validation.error || "Invalid input",
      statusMessage: "error",
    };
  }

  try {
    // Ambil data muzakki untuk mendapatkan nama
    const muzakki = await db.muzakki.findUnique({
      where: { id: validation.data.muzakkiId },
    });

    if (!muzakki) {
      return {
        message: "Muzakki tidak ditemukan",
        statusMessage: "error",
      };
    }

    await db.mustahikWarga.update({
      where: { id },
      data: {
        muzakkiId: validation.data.muzakkiId,
        nama: muzakki.nama_muzakki, // Otomatis dari nama muzakki
        kategoriId: validation.data.kategoriId,
        hak: validation.data.hak,
      },
    });

    revalidatePath("/distribusi-zakat-warga");
    return {
      message: "Mustahik warga berhasil diupdate",
      statusMessage: "success",
    };
  } catch (error) {
    return renderError(error);
  }
}

export async function deleteMustahikWargaAction(_: any, formData: FormData): Promise<{ message: string; statusMessage: statusMessage }> {
  const id = formData.get("id") as string;

  try {
    await db.mustahikWarga.delete({
      where: { id },
    });

    revalidatePath("/distribusi-zakat-warga");
    return {
      message: "Mustahik warga berhasil dihapus",
      statusMessage: "success",
    };
  } catch (error) {
    return renderError(error);
  }
}

// ===== MUSTAHIK LAINNYA ACTIONS =====
export async function createMustahikLainnyaAction(_: any, formData: FormData): Promise<{ message: string; statusMessage: statusMessage }> {
  const validation = await validateForm(mustahikLainnyaSchema, formData);

  if (!validation.success) {
    return {
      message: validation.error || "Invalid input",
      statusMessage: "error",
    };
  }

  try {
    await db.mustahikLainnya.create({
      data: {
        nama: validation.data.nama,
        kategoriId: validation.data.kategoriId,
        hak: validation.data.hak,
      },
    });

    revalidatePath("/distribusi-zakat-lainnya");
    return {
      message: "Mustahik lainnya berhasil ditambahkan",
      statusMessage: "success",
    };
  } catch (error) {
    return renderError(error);
  }
}

export async function getMustahikLainnyaList() {
  const mustahikLainnyaList = await db.mustahikLainnya.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      kategori: true,
    },
  });
  return mustahikLainnyaList;
}

export async function updateMustahikLainnyaAction(_: any, formData: FormData): Promise<{ message: string; statusMessage: statusMessage }> {
  const id = formData.get("id") as string;
  const validation = await validateForm(mustahikLainnyaSchema, formData);

  if (!validation.success) {
    return {
      message: validation.error || "Invalid input",
      statusMessage: "error",
    };
  }

  try {
    await db.mustahikLainnya.update({
      where: { id },
      data: {
        nama: validation.data.nama,
        kategoriId: validation.data.kategoriId,
        hak: validation.data.hak,
      },
    });

    revalidatePath("/distribusi-zakat-lainnya");
    return {
      message: "Mustahik lainnya berhasil diupdate",
      statusMessage: "success",
    };
  } catch (error) {
    return renderError(error);
  }
}

export async function deleteMustahikLainnyaAction(_: any, formData: FormData): Promise<{ message: string; statusMessage: statusMessage }> {
  const id = formData.get("id") as string;

  try {
    await db.mustahikLainnya.delete({
      where: { id },
    });

    revalidatePath("/distribusi-zakat-lainnya");
    return {
      message: "Mustahik lainnya berhasil dihapus",
      statusMessage: "success", // Changed from "error" to "success"
    };
  } catch (error) {
    return renderError(error);
  }
}

export async function getBayarZakatListIncl() {
  const bayarZakatList = await db.bayarZakat.findMany({
    include: {
      muzakki: true,
    },
  });
  return bayarZakatList;
}
export async function getKategoriList() {
  const kategoriList = await db.kategoriMustahik.findMany();

  return kategoriList;
}

export async function getMustahikWargaKategori() {
  // Get all mustahik warga with their kategori
  const mustahikWarga = await db.mustahikWarga.findMany({
    include: {
      kategori: true,
    },
  });
  return mustahikWarga;
}

export async function getMustahikLainnyaListIncl() {
  // Get all mustahik lainnya with their kategori
  const mustahikLainnya = await db.mustahikLainnya.findMany({
    include: {
      kategori: true,
    },
  });

  return mustahikLainnya;
}
