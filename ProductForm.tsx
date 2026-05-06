"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <nav style={{
        background: "linear-gradient(135deg, #FF6B9D 0%, #9B72F5 100%)",
        position: "sticky", top: 0, zIndex: 50,
        boxShadow: "0 4px 20px rgba(255,107,157,0.3)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 28 }}>🌸</span>
            <div>
              <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: "#fff", lineHeight: 1 }}>Style by Kenisha</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", letterSpacing: 2, textTransform: "uppercase" }}>Kids Fashion</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 28 }} className="hidden-mobile">
            {[
              { href: "/", label: "🏠 Home" },
              { href: "/products", label: "👗 Shop" },
              { href: "/about", label: "💌 About" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{
                color: "#fff", textDecoration: "none",
                fontWeight: 700, fontSize: 15,
                padding: "6px 16px", borderRadius: 50,
                transition: "background 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >{label}</Link>
            ))}
          </div>

          {/* Right icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/products" style={{
              background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.4)",
              color: "#fff", padding: "8px 14px", borderRadius: 50,
              fontWeight: 700, fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
            }}>🔍 Search</Link>

            <button onClick={() => setCartOpen(true)} style={{
              background: "#fff", border: "none", borderRadius: 50,
              padding: "8px 16px", fontWeight: 800, fontSize: 13,
              color: "#FF6B9D", cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              position: "relative", boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}>
              🛒 Cart
              {totalItems > 0 && (
                <span style={{
                  background: "#FFB800", color: "#fff", borderRadius: "50%",
                  width: 18, height: 18, fontSize: 10, fontWeight: 900,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "absolute", top: -6, right: -6,
                }}>{totalItems}</span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 20 }}
              className="show-mobile"
            >☰</button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: "rgba(255,107,157,0.95)", padding: "12px 20px 20px" }}>
            {[
              { href: "/", label: "🏠 Home" },
              { href: "/products", label: "👗 Shop All" },
              { href: "/about", label: "💌 About Us" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
                display: "block", color: "#fff", textDecoration: "none",
                fontWeight: 700, fontSize: 16, padding: "10px 0",
                borderBottom: "1px solid rgba(255,255,255,0.2)",
              }}>{label}</Link>
            ))}
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <style>{`
        @media(max-width:768px){ .hidden-mobile{display:none!important;} }
        @media(min-width:769px){ .show-mobile{display:none!important;} }
      `}</style>
    </>
  );
}
