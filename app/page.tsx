"use client";

import { SplashCursor } from "@/components/ui/splash-cursor";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useAuth, useClerk } from "@clerk/nextjs";

export default function AuthPage() {
  const [mounted, setMounted] = useState(false);
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { openSignIn, openSignUp } = useClerk();

  // Redirect jika sudah login
  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard"); // Redirect ke dashboard jika sudah login
    }
    setMounted(true);
    return () => setMounted(false);
  }, [isSignedIn, router]);

  // Handler untuk menampilkan modal
  const handleSignIn = () => {
    // Gunakan metode openSignIn tanpa parameter
    openSignIn();
  };

  const handleSignUp = () => {
    // Gunakan metode openSignUp tanpa parameter
    openSignUp();
  };

  return (
    <>
      <SplashCursor />
      <div className="flex min-h-screen items-center justify-center bg-white">
        {/* Subtle background patterns */}
        <div className="absolute inset-0 overflow-hidden opacity-5">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-emerald-100 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-teal-100 rounded-full blur-3xl"></div>
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-10 w-full max-w-md">
              {mounted && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto flex flex-col items-center space-y-2">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <path d="M2 17l10 5 10-5"></path>
                      <path d="M2 12l10 5 10-5"></path>
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tighter text-emerald-700">ZakatFlow</h1>
                  <p className="text-sm text-slate-500">Platform Amanah untuk Zakat Anda</p>
                </motion.div>
              )}

              {mounted && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                  <Card className="w-full bg-white border border-slate-200 shadow-md">
                    <CardHeader className="space-y-1 pb-2">
                      <CardTitle className="text-2xl font-bold tracking-tight text-slate-800">Selamat Datang</CardTitle>
                      <CardDescription className="text-slate-500">Mulai perjalanan amal Anda bersama kami</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 py-6">
                      <div className="grid gap-4">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button onClick={handleSignIn} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium py-6 text-lg border-none">
                            Masuk
                          </Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button onClick={handleSignUp} variant="outline" className="w-full border-slate-300 bg-transparent hover:bg-slate-50 text-slate-700 font-medium py-6 text-lg">
                            Daftar
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 pt-0">
                      <div className="text-sm text-slate-600 text-center">
                        &ldquo;Harta tidak akan berkurang karena sedekah&rdquo;
                        <div className="text-xs mt-1 text-slate-500">- HR. Tirmidzi</div>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}

              {mounted && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex flex-col items-center space-y-2">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                  <p className="text-xs text-slate-400">© 2025 ZakatFlow. Semua hak dilindungi.</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
