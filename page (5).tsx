"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/admin/dashboard");
    } catch {
      setError("❌ Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#FF6B9D 0%,#9B72F5 50%,#5BC4F5 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      {/* Floating decorations */}
      {["🌸", "⭐", "🎀", "💫", "🌈"].map((em, i) => (
        <span key={i} className={i % 2 === 0 ? "float" : "float-slow"} style={{
          position: "fixed", fontSize: [32, 24, 28, 20, 26][i],
          top: ["10%", "20%", "5%", "80%", "70%"][i],
          left: ["5%", "90%", "50%", "8%", "88%"][i],
          opacity: 0.3, pointerEvents: "none",
        }}>{em}</span>
      ))}

      <div style={{
        background: "#fff", borderRadius: 28, padding: "40px 36px",
        width: "100%", maxWidth: 420,
        boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
        position: "relative",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 28, color: "#2D2D2D", marginBottom: 4 }}>
            Admin Panel
          </div>
          <div style={{ color: "#aaa", fontSize: 14 }}>Style by Kenisha · Secure Access</div>
        </div>

        {/* CREDENTIALS INFO BOX */}
        <div style={{
          background: "linear-gradient(135deg,#FFF0F9,#F0F0FF)",
          border: "2px solid #FFB5C8", borderRadius: 16, padding: 16, marginBottom: 24,
        }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: "#FF6B9D", marginBottom: 8 }}>🔑 Admin Credentials</div>
          <div style={{ fontSize: 13, color: "#666", lineHeight: 1.8 }}>
            <strong>Email:</strong> admin@stylebykenisha.shop<br />
            <strong>Password:</strong> Kenisha@Admin2024!<br />
            <span style={{ fontSize: 11, color: "#aaa" }}>⚠️ Change after first login in Firebase Console</span>
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 800, fontSize: 13, color: "#555", display: "block", marginBottom: 6 }}>📧 Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@stylebykenisha.shop"
              required
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 50,
                border: "2px solid #FFB5C8", outline: "none",
                fontFamily: "'Nunito',sans-serif", fontSize: 14,
                transition: "border-color 0.2s",
              }}
              onFocus={e => (e.target.style.borderColor = "#FF6B9D")}
              onBlur={e => (e.target.style.borderColor = "#FFB5C8")}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontWeight: 800, fontSize: 13, color: "#555", display: "block", marginBottom: 6 }}>🔒 Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%", padding: "12px 48px 12px 16px", borderRadius: 50,
                  border: "2px solid #FFB5C8", outline: "none",
                  fontFamily: "'Nunito',sans-serif", fontSize: 14,
                }}
                onFocus={e => (e.target.style.borderColor = "#FF6B9D")}
                onBlur={e => (e.target.style.borderColor = "#FFB5C8")}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{
                position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", fontSize: 16,
              }}>{showPass ? "🙈" : "👁️"}</button>
            </div>
          </div>

          {error && (
            <div style={{ background: "#FFF0F0", border: "2px solid #FFB5B5", borderRadius: 12, padding: "10px 16px", marginBottom: 20, color: "#FF4444", fontSize: 14, fontWeight: 700 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: "100%",
            background: loading ? "#ddd" : "linear-gradient(135deg,#FF6B9D,#9B72F5)",
            color: "#fff", border: "none", borderRadius: 50,
            padding: "14px", fontWeight: 800, fontSize: 16, cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "'Nunito',sans-serif",
            boxShadow: loading ? "none" : "0 6px 20px rgba(255,107,157,0.4)",
            transition: "all 0.3s",
          }}>
            {loading ? "🔄 Signing in..." : "🔐 Sign In to Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
