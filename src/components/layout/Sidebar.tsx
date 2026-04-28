"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
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
    </div>
  );
}
