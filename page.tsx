"use client";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { Product } from "../lib/productService";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const wished = wishlist.includes(product.id!);

  const disc = product.discount || 0;
  const orig = product.originalPrice;

  return (
    <div className="product-card" style={{
      background: "#fff", borderRadius: 24, overflow: "hidden",
      border: "2px solid #FFE0EE",
      boxShadow: "0 4px 16px rgba(255,107,157,0.08)",
      position: "relative",
    }}>
      {/* Image */}
      <div style={{ position: "relative", height: 220, background: "linear-gradient(135deg, #FFF0F9, #F0F0FF)" }}>
        <Link href={`/products/${product.id}`}>
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: 56 }}>👗</span>
              <span style={{ color: "#FFB5C8", fontSize: 12, fontWeight: 600 }}>No Image</span>
            </div>
          )}
        </Link>

        {/* Badges */}
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", flexDirection: "column", gap: 4 }}>
          {disc > 0 && (
            <span style={{ background: "linear-gradient(135deg,#FF6B9D,#FF3D7F)", color: "#fff", borderRadius: 50, padding: "3px 10px", fontSize: 11, fontWeight: 900, fontFamily: "'Fredoka One',cursive" }}>
              🏷️ {disc}% OFF
            </span>
          )}
          {!product.inStock && (
            <span style={{ background: "#555", color: "#fff", borderRadius: 50, padding: "3px 10px", fontSize: 11, fontWeight: 800 }}>
              😢 Sold Out
            </span>
          )}
          {product.featured && (
            <span style={{ background: "linear-gradient(135deg,#FFB800,#FF9900)", color: "#fff", borderRadius: 50, padding: "3px 10px", fontSize: 11, fontWeight: 900 }}>
              ⭐ Featured
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button onClick={() => toggleWishlist(product.id!)} style={{
          position: "absolute", top: 10, right: 10,
          background: "#fff", border: "2px solid #FFB5C8",
          borderRadius: "50%", width: 36, height: 36,
          cursor: "pointer", fontSize: 18,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.2s",
        }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.2)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        >{wished ? "❤️" : "🤍"}</button>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
          <span style={{ background: "#F0F0FF", color: "#9B72F5", borderRadius: 50, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
            {product.category}
          </span>
          <span style={{ background: "#FFF0F5", color: "#FF6B9D", borderRadius: 50, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
            {product.ageGroup}
          </span>
        </div>

        <Link href={`/products/${product.id}`} style={{ textDecoration: "none" }}>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "#2D2D2D", marginBottom: 6, lineHeight: 1.3 }}>
            {product.name}
          </div>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontFamily: "'Fredoka One',cursive", fontSize: 22, color: "#FF6B9D" }}>₹{product.price}</span>
          {orig && orig > product.price && (
            <span style={{ fontSize: 14, color: "#aaa", textDecoration: "line-through" }}>₹{orig}</span>
          )}
        </div>

        <button
          onClick={() => product.inStock && addToCart(product)}
          disabled={!product.inStock}
          style={{
            width: "100%",
            background: product.inStock ? "linear-gradient(135deg,#FF6B9D,#9B72F5)" : "#eee",
            color: product.inStock ? "#fff" : "#aaa",
            border: "none", borderRadius: 50,
            padding: "10px 0", fontWeight: 800, fontSize: 14,
            cursor: product.inStock ? "pointer" : "not-allowed",
            transition: "all 0.3s",
            fontFamily: "'Nunito',sans-serif",
          }}
          onMouseEnter={e => product.inStock && (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        >
          {product.inStock ? "🛒 Add to Cart" : "😢 Out of Stock"}
        </button>
      </div>
    </div>
  );
}
