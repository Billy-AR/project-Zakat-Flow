import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Image from "next/image";

interface Profile01Props {
  name: string;
  role: string;
  avatar: string;
  subscription?: string;
}

const defaultProfile = {
  name: "Eugene An",
  role: "Admin",
  avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-02-albo9B0tWOSLXCVZh9rX9KFxXIVWMr.png",
  subscription: "Free Trial",
} satisfies Required<Profile01Props>;

export default function Profile01({ name = defaultProfile.name, role = defaultProfile.role, avatar = defaultProfile.avatar }: Partial<Profile01Props> = defaultProfile) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="relative px-6 pt-12 pb-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative shrink-0">
              <Image src={avatar} alt={name} width={40} height={40} className="rounded-full ring-4 ring-white dark:ring-zinc-900 object-cover" />
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-md font-semibold text-zinc-900 dark:text-zinc-100">{name}</h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">{role}</p>
            </div>
          </div>
          <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-6" />
          <div className="space-y-2">
            <button
              type="button"
              className="w-full flex items-center justify-between p-2 
                                hover:bg-zinc-50 dark:hover:bg-zinc-800/50 
                                rounded-lg transition-colors duration-200"
            >
              <SignOutButton>
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Logout</span>
                </div>
              </SignOutButton>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
