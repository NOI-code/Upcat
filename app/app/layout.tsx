import type React from "react"
import { Toaster } from "@/components/ui/toaster"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {children}
      <Toaster />
    </div>
  )
}
