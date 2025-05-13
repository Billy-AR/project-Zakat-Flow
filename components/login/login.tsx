"use client";

import React from "react";
import Link from "next/link";
import { User, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

// 0. Login Page
export function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Login Admin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <div className="relative">
              <User className="absolute top-3 left-3 text-gray-400" />
              <Input type="email" className="pl-10" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute top-3 left-3 text-gray-400" />
              <Input type="password" className="pl-10" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button size="lg" className="w-full mb-2">
            Login
          </Button>
          <Link href="/register" className="text-center text-sm text-blue-600 hover:underline">
            Belum punya akun? Register
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
