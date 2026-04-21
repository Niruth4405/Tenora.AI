"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={10}
      toastOptions={{
        duration: 3500,
        style: {
          background: "rgba(15, 19, 24, 0.95)",
          color: "#ffffff",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "18px",
          padding: "14px 16px",
          boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
          backdropFilter: "blur(12px)",
          fontSize: "14px",
        },
        success: {
          iconTheme: {
            primary: "#34d399",
            secondary: "#0b0d10",
          },
        },
        error: {
          iconTheme: {
            primary: "#fb7185",
            secondary: "#0b0d10",
          },
        },
      }}
    />
  );
}