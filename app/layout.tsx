import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ToastProvider } from "@/components/ui/Toast";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "TaskTrack",
  description: "Departments, projects and tasks in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <ToastProvider>
          <AuthProvider>
            <Navbar />
            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
