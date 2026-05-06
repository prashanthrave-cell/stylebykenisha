"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function AdminIndexPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      router.push(user ? "/admin/dashboard" : "/admin/login");
    }
  }, [user, loading, router]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#FF6B9D,#9B72F5)" }}>
      <div style={{ color: "#fff", fontFamily: "'Fredoka One',cursive", fontSize: 24 }}>🌸 Loading Admin...</div>
    </div>
  );
}
