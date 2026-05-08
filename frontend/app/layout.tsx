"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import "../public/styles.css";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <html lang="id">
      <body
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "100vh",
          backgroundAttachment: "fixed",
          paddingTop: "80px", // Space for fixed navbar
        }}
      >
        <Navbar />
        <main>{children}</main>
        <footer
          className="bg-dark text-white text-center py-4 mt-5"
          style={{
            background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
            borderTop: "3px solid #3498db",
          }}
        >
          <div className="container">
            <p className="mb-2">
              &copy; 2024 Sinema Jakarta. Semua hak cipta dilindungi.
            </p>
            <p className="mb-0 small text-muted">
              Dibuat dengan ❤️ untuk pecinta film Indonesia
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
