"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormContainer from "@/components/form-container";
import { saveMuzakki } from "@/app/actions/muzakki";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  id: z.string().optional(),
  nama_muzakki: z.string().min(2, {
    message: "Nama harus diisi minimal 2 karakter",
  }),
  jumlah_tanggungan: z.coerce.number().min(1, {
    message: "Jumlah tanggungan minimal 1 orang",
  }),
  keterangan: z.string().optional(),
});

export default function MuzakkiForm({ muzakki, onSuccess }: { muzakki?: any; onSuccess?: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: muzakki?.id || "",
      nama_muzakki: muzakki?.nama_muzakki || "",
      jumlah_tanggungan: muzakki?.jumlah_tanggungan || 1,
      keterangan: muzakki?.keterangan || "",
    },
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{muzakki ? "Edit Muzakki" : "Tambah Muzakki"}</CardTitle>
      </CardHeader>
      <CardContent>
        <FormContainer
          action={async (formData) => {
            setIsLoading(true);
            try {
              // Copy form values to formData
              const values = form.getValues();
              Object.entries(values).forEach(([key, value]) => {
                if (value !== undefined) {
                  formData.append(key, String(value));
                }
              });

              const result = await saveMuzakki(formData);

              if (result.statusMessage === "success" && onSuccess) {
                onSuccess();
                form.reset({
                  nama_muzakki: "",
                  jumlah_tanggungan: 1,
                  keterangan: "",
                });
              }

              return result;
            } finally {
              setIsLoading(false);
            }
          }}
          submitBtn={true}
        >
          <Form {...form}>
            <div className="space-y-4">
              {muzakki?.id && <input type="hidden" name="id" value={muzakki.id} />}

              <FormField
                control={form.control}
                name="nama_muzakki"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Muzakki</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jumlah_tanggungan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah Tanggungan</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="keterangan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keterangan</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Masukkan keterangan (opsional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </FormContainer>
      </CardContent>
    </Card>
  );
}
