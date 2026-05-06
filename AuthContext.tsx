"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { getProducts, deleteProduct, updateProduct, Product } from "../../lib/productService";

export default function AdminDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.push("/admin/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      getProducts().then(setProducts).finally(() => setLoading(false));
    }
  }, [user]);

  const handleDelete = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setDeleting(p.id!);
    await deleteProduct(p.id!, p.images || []);
    setProducts(prev => prev.filter(x => x.id !== p.id));
    setDeleting(null);
    showMsg("✅ Product deleted!");
  };

  const toggleStock = async (p: Product) => {
    await updateProduct(p.id!, { inStock: !p.inStock });
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, inStock: !x.inStock } : x));
  };

  const toggleFeatured = async (p: Product) => {
    await updateProduct(p.id!, { featured: !p.featured });
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, featured: !x.featured } : x));
  };

  const showMsg = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: products.length,
    inStock: products.filter(p => p.inStock).length,
    featured: products.filter(p => p.featured).length,
    offers: products.filter(p => (p.discount || 0) > 0).length,
  };

  if (authLoading || !user) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#FF6B9D,#9B72F5)" }}>
      <div style={{ color: "#fff", fontFamily: "'Fredoka One',cursive", fontSize: 24 }}>🌸 Loading...</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F8F4FF" }}>

      {/* Admin Navbar */}
      <nav style={{ background: "linear-gradient(135deg,#FF6B9D,#9B72F5)", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#fff" }}>
          🌸 Kenisha Admin Panel
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href="/" target="_blank" style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            🌐 View Site
          </Link>
          <button onClick={async () => { await logout(); router.push("/admin/login"); }} style={{
            background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.4)",
            color: "#fff", borderRadius: 50, padding: "6px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer",
          }}>
            🚪 Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>

        {/* Toast */}
        {msg && (
          <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#1b4332", color: "#fff", padding: "12px 24px", borderRadius: 50, fontWeight: 700, zIndex: 999, fontSize: 14 }}>
            {msg}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Total Products", value: stats.total, emoji: "📦", color: "#FF6B9D", bg: "#FFF0F5" },
            { label: "In Stock", value: stats.inStock, emoji: "✅", color: "#3ECFA0", bg: "#F0FFF8" },
            { label: "Featured", value: stats.featured, emoji: "⭐", color: "#FFB800", bg: "#FFFBEC" },
            { label: "On Sale", value: stats.offers, emoji: "🏷️", color: "#9B72F5", bg: "#F8F4FF" },
          ].map(({ label, value, emoji, color, bg }) => (
            <div key={label} style={{ background: bg, border: `2px solid ${color}40`, borderRadius: 20, padding: "20px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{emoji}</div>
              <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 32, color }}>{value}</div>
              <div style={{ fontSize: 12, color: "#888", fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Header + Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 28, color: "#2D2D2D" }}>📦 All Products</h1>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Search products..."
              style={{ padding: "10px 18px", borderRadius: 50, border: "2px solid #D8C8FF", outline: "none", fontFamily: "'Nunito',sans-serif", fontSize: 14, width: 220 }}
            />
            <Link href="/admin/products/add" style={{
              background: "linear-gradient(135deg,#FF6B9D,#9B72F5)", color: "#fff",
              padding: "10px 22px", borderRadius: 50, fontWeight: 800, fontSize: 14, textDecoration: "none",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              ➕ Add Product
            </Link>
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div className="float" style={{ fontSize: 48 }}>🌸</div>
            <p style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#FF6B9D", marginTop: 12 }}>Loading products...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px", background: "#fff", borderRadius: 24, border: "2px dashed #D8C8FF" }}>
            <div style={{ fontSize: 56 }}>📦</div>
            <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 24, color: "#9B72F5", margin: "12px 0 8px" }}>No Products Yet!</div>
            <Link href="/admin/products/add" style={{ background: "linear-gradient(135deg,#FF6B9D,#9B72F5)", color: "#fff", padding: "12px 28px", borderRadius: 50, fontWeight: 800, textDecoration: "none" }}>
              ➕ Add Your First Product
            </Link>
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", border: "2px solid #F0E8FF", boxShadow: "0 4px 20px rgba(155,114,245,0.1)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "linear-gradient(135deg,#FFF0F9,#F8F4FF)" }}>
                  {["Product", "Category", "Price", "Stock", "Featured", "Actions"].map(h => (
                    <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontWeight: 800, fontSize: 13, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} style={{ borderTop: "1px solid #F5F0FF", background: i % 2 === 0 ? "#fff" : "#FEFCFF" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, overflow: "hidden", background: "#FFF0F5", flexShrink: 0 }}>
                          {p.images?.[0] ? <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👗</div>}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 14, color: "#2D2D2D" }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: "#aaa" }}>{p.ageGroup}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ background: "#F0F0FF", color: "#9B72F5", borderRadius: 50, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>{p.category}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 800, color: "#FF6B9D", fontSize: 16 }}>₹{p.price}</div>
                      {p.discount ? <div style={{ fontSize: 11, color: "#3ECFA0", fontWeight: 700 }}>🏷️ {p.discount}% off</div> : null}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button onClick={() => toggleStock(p)} style={{
                        background: p.inStock ? "#F0FFF8" : "#FFF0F0",
                        border: `2px solid ${p.inStock ? "#B8F0D8" : "#FFB5B5"}`,
                        color: p.inStock ? "#3ECFA0" : "#FF4444",
                        borderRadius: 50, padding: "4px 12px", fontSize: 12, fontWeight: 800, cursor: "pointer",
                      }}>
                        {p.inStock ? "✅ In Stock" : "😢 Sold Out"}
                      </button>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button onClick={() => toggleFeatured(p)} style={{
                        background: p.featured ? "#FFFBEC" : "#F5F5F5",
                        border: `2px solid ${p.featured ? "#FFE080" : "#ddd"}`,
                        color: p.featured ? "#FFB800" : "#aaa",
                        borderRadius: 50, padding: "4px 12px", fontSize: 12, fontWeight: 800, cursor: "pointer",
                      }}>
                        {p.featured ? "⭐ Yes" : "☆ No"}
                      </button>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Link href={`/admin/products/${p.id}/edit`} style={{
                          background: "#F0F0FF", color: "#9B72F5", border: "2px solid #D8C8FF",
                          borderRadius: 50, padding: "6px 14px", fontSize: 12, fontWeight: 800, textDecoration: "none",
                        }}>✏️ Edit</Link>
                        <button onClick={() => handleDelete(p)} disabled={deleting === p.id} style={{
                          background: "#FFF0F0", color: "#FF4444", border: "2px solid #FFB5B5",
                          borderRadius: 50, padding: "6px 14px", fontSize: 12, fontWeight: 800, cursor: "pointer",
                        }}>{deleting === p.id ? "..." : "🗑️ Del"}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
