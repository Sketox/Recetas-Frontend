"use client";

import { AuthProvider } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = ["/login", "/register"].includes(pathname);

  return (
    <AuthProvider>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </AuthProvider>
  );
}
