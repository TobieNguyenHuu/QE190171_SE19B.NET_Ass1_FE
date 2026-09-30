import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "TaskTrack",
  description: "Departments, projects and tasks in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <ToastProvider>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
