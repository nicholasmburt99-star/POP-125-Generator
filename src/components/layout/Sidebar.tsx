"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { FileText, Plus, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <div className="flex w-64 flex-col border-r bg-white">
      <div className="border-b p-4">
        <h1 className="text-lg font-bold">POP Generator</h1>
        <p className="text-xs text-gray-500">Section 125 Documents</p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        <Link href="/dashboard/generate">
          <Button
            variant={pathname === "/dashboard/generate" ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
          >
            <Plus className="h-4 w-4" />
            Generate New
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button
            variant={pathname === "/dashboard" ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
          >
            <FileText className="h-4 w-4" />
            All Documents
          </Button>
        </Link>
      </nav>

      <div className="border-t p-3 space-y-2">
        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span className="truncate">{userName}</span>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-gray-500"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
