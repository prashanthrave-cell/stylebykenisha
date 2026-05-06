"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { addProduct, updateProduct, uploadImage, Product } from "../../../lib/productService";

const CATEGORIES = ["Frocks", "Baby Wear", "Toddler", "Dresses", "Sets", "Tops", "Bottoms", "Ethnic Wear"];
const AGE_GROUPS = ["0-6 months", "6-12 months", "1-2 years", "2-4 years", "4-6 years", "6-8 years", "8-10 years"];

interface Props { product?: Product; }

export default function ProductForm({ product }: Props) {
  const router = useRouter();
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    originalPrice: product?.originalPrice?.toString() || "",
    discount: product?.discount?.toString() || "",
    category: product?.category || CATEGORIES[0],
    ageGroup: product?.ageGroup || AGE_GROUPS[0],
    inStock: product?.inStock ?? true,
    featured: product?.featured ?? false,
    tags: product?.tags?.join(", ") || "",
  });

  const [existingImages, setExistingImages] = useState<string[]>(product?.images || []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter(f => f.type.startsWith("image/"));
    setNewFiles(prev => [...prev, ...valid]);
    valid.forEach(f => {
      const reader = new FileReader();
      reader.onload = e => setPreviews(p => [...p, e.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeNew = (i: number) => {
    setNewFiles(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };
  const removeExisting = (i: number) => setExistingImages(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) { setError("Name and price are required."); return; }
    setSaving(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of newFiles) {
        const url = await uploadImage(file);
        uploaded.push(url);
      }
      const allImages = [...existingImages, ...uploaded];
      const data = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        discount: form.discount ? parseFloat(form.discount) : 0,
        category: form.category,
        ageGroup: form.ageGroup,
        inStock: form.inStock,
        featured: form.featured,
        images: allImages,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      };
      if (isEdit) {
        await updateProduct(product!.id!, data);
      } else {
        await addProduct(data as Omit<Product, "id">);
      }
      router.push("/admin/dashboard");
    } catch (err) {
      setError("Failed to save. Check Firebase config & try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: 14,
    border: "2px solid #D8C8FF", outline: "none",
    fontFamily: "'Nunito',sans-serif", fontSize: 14,
    transition: "border-color 0.2s", background: "#fff",
  };

  const labelStyle = { fontWeight: 800, fontSize: 13, color: "#666", display: "block", marginBottom: 6 };

  return (
    <div style={{ minHeight: "100vh", background: "#F8F4FF" }}>
      {/* Admin Nav */}
      <nav style={{ background: "linear-gradient(135deg,#FF6B9D,#9B72F5)", padding: "0 24px", height: 60, display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => router.push("/admin/dashboard")} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 50, padding: "6px 14px", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
          ← Back
        </button>
        <span style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#fff" }}>
          {isEdit ? "✏️ Edit Product" : "➕ Add New Product"}
        </span>
      </nav>

      <div style={{ maxWidth: 800, margin: "32px auto", padding: "0 24px" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

            {/* Left column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Image Upload */}
              <div style={{ background: "#fff", borderRadius: 20, padding: 24, border: "2px solid #F0E8FF" }}>
                <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: "#9B72F5", marginBottom: 16 }}>🖼️ Product Images</div>

                <div
                  onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => document.getElementById("fileInput")?.click()}
                  style={{
                    border: `3px dashed ${dragOver ? "#FF6B9D" : "#D8C8FF"}`,
                    borderRadius: 16, padding: "28px 20px", textAlign: "center",
                    cursor: "pointer", background: dragOver ? "#FFF0F9" : "#FEFCFF",
                    transition: "all 0.2s", marginBottom: 16,
                  }}
                >
                  <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
                  <div style={{ fontWeight: 800, color: "#9B72F5", fontSize: 14 }}>Drop images here or click to upload</div>
                  <div style={{ color: "#aaa", fontSize: 12, marginTop: 4 }}>JPG, PNG, WEBP · Multiple allowed</div>
                  <input id="fileInput" type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
                </div>

                {/* Existing images */}
                {existingImages.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#aaa", marginBottom: 8 }}>EXISTING IMAGES</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {existingImages.map((img, i) => (
                        <div key={i} style={{ position: "relative", width: 72, height: 72 }}>
                          <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10, border: "2px solid #D8C8FF" }} />
                          <button type="button" onClick={() => removeExisting(i)} style={{ position: "absolute", top: -6, right: -6, background: "#FF4444", color: "#fff", border: "none", borderRadius: "50%", width: 20, height: 20, cursor: "pointer", fontSize: 10, fontWeight: 900 }}>✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New previews */}
                {previews.length > 0 && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#aaa", marginBottom: 8 }}>NEW IMAGES</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {previews.map((p, i) => (
                        <div key={i} style={{ position: "relative", width: 72, height: 72 }}>
                          <img src={p} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10, border: "2px solid #B8F0D8" }} />
                          <button type="button" onClick={() => removeNew(i)} style={{ position: "absolute", top: -6, right: -6, background: "#FF4444", color: "#fff", border: "none", borderRadius: "50%", width: 20, height: 20, cursor: "pointer", fontSize: 10, fontWeight: 900 }}>✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div style={{ background: "#fff", borderRadius: 20, padding: 24, border: "2px solid #F0E8FF" }}>
                <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: "#9B72F5", marginBottom: 16 }}>⚙️ Settings</div>

                {[
                  { label: "✅ In Stock", key: "inStock", desc: "Product is available to buy" },
                  { label: "⭐ Featured", key: "featured", desc: "Show on homepage featured section" },
                ].map(({ label, key, desc }) => (
                  <div key={key} onClick={() => set(key, !form[key as keyof typeof form])} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "14px 16px", borderRadius: 14, marginBottom: 10,
                    background: form[key as keyof typeof form] ? "#F0FFF8" : "#F8F4FF",
                    border: `2px solid ${form[key as keyof typeof form] ? "#B8F0D8" : "#EEE8FF"}`,
                    cursor: "pointer", transition: "all 0.2s",
                  }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>{label}</div>
                      <div style={{ fontSize: 12, color: "#aaa" }}>{desc}</div>
                    </div>
                    <div style={{
                      width: 44, height: 24, borderRadius: 50, position: "relative",
                      background: form[key as keyof typeof form] ? "#3ECFA0" : "#ddd",
                      transition: "background 0.2s",
                    }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: "50%", background: "#fff",
                        position: "absolute", top: 3,
                        left: form[key as keyof typeof form] ? 23 : 3,
                        transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: "#fff", borderRadius: 20, padding: 24, border: "2px solid #F0E8FF" }}>
                <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: "#9B72F5", marginBottom: 16 }}>📝 Product Details</div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Product Name *</label>
                  <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Pink Floral Frock" style={inputStyle} required
                    onFocus={e => (e.target.style.borderColor = "#FF6B9D")} onBlur={e => (e.target.style.borderColor = "#D8C8FF")} />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Description</label>
                  <textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="Describe the outfit..." rows={3} style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={e => (e.target.style.borderColor = "#FF6B9D")} onBlur={e => (e.target.style.borderColor = "#D8C8FF")} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle}>Selling Price (₹) *</label>
                    <input type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="599" min="0" style={inputStyle} required
                      onFocus={e => (e.target.style.borderColor = "#FF6B9D")} onBlur={e => (e.target.style.borderColor = "#D8C8FF")} />
                  </div>
                  <div>
                    <label style={labelStyle}>Original Price (₹)</label>
                    <input type="number" value={form.originalPrice} onChange={e => set("originalPrice", e.target.value)} placeholder="799" min="0" style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = "#FF6B9D")} onBlur={e => (e.target.style.borderColor = "#D8C8FF")} />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Discount % (for badge)</label>
                  <input type="number" value={form.discount} onChange={e => set("discount", e.target.value)} placeholder="25" min="0" max="100" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = "#FF6B9D")} onBlur={e => (e.target.style.borderColor = "#D8C8FF")} />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Category</label>
                  <select value={form.category} onChange={e => set("category", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Age Group</label>
                  <select value={form.ageGroup} onChange={e => set("ageGroup", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                    {AGE_GROUPS.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: 8 }}>
                  <label style={labelStyle}>Tags (comma separated)</label>
                  <input value={form.tags} onChange={e => set("tags", e.target.value)} placeholder="frock, summer, floral, pink" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = "#FF6B9D")} onBlur={e => (e.target.style.borderColor = "#D8C8FF")} />
                </div>
              </div>

              {error && (
                <div style={{ background: "#FFF0F0", border: "2px solid #FFB5B5", borderRadius: 14, padding: "12px 16px", color: "#FF4444", fontSize: 14, fontWeight: 700 }}>{error}</div>
              )}

              <button type="submit" disabled={saving} style={{
                background: saving ? "#ddd" : "linear-gradient(135deg,#FF6B9D,#9B72F5)",
                color: "#fff", border: "none", borderRadius: 50,
                padding: "16px", fontWeight: 800, fontSize: 17, cursor: saving ? "not-allowed" : "pointer",
                fontFamily: "'Nunito',sans-serif",
                boxShadow: saving ? "none" : "0 6px 24px rgba(255,107,157,0.4)",
              }}>
                {saving ? "🔄 Saving..." : isEdit ? "✅ Update Product" : "✅ Add Product"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @media(max-width:768px){ form > div { grid-template-columns:1fr!important; } }
      `}</style>
    </div>
  );
}
