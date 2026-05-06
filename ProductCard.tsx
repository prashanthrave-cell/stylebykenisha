import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      background: "linear-gradient(135deg, #FF6B9D 0%, #9B72F5 100%)",
      color: "#fff", padding: "40px 24px 20px", marginTop: 60,
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 32, marginBottom: 32 }}>
          {/* Brand */}
          <div>
            <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 24, marginBottom: 8 }}>🌸 Style by Kenisha</div>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.7 }}>
              Adorable, affordable & fun kids clothing. Because every little one deserves to look cute! 💕
            </p>
          </div>

          {/* Links */}
          <div>
            <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, marginBottom: 12 }}>Quick Links</div>
            {[
              { href: "/", label: "🏠 Home" },
              { href: "/products", label: "👗 Shop All" },
              { href: "/about", label: "💌 About Us" },
            ].map(({ href, label }) => (
              <div key={href} style={{ marginBottom: 8 }}>
                <Link href={href} style={{ color: "rgba(255,255,255,0.85)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>{label}</Link>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, marginBottom: 12 }}>Contact Us 💬</div>
            <div style={{ fontSize: 14, lineHeight: 2, color: "rgba(255,255,255,0.9)" }}>
              <div>📞 <a href="tel:6361360153" style={{ color: "#fff", textDecoration: "none", fontWeight: 700 }}>63613 60153</a></div>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <a href="https://wa.me/916361360153?text=Hi%20Style%20by%20Kenisha!" target="_blank" rel="noopener noreferrer"
                  style={{ background: "#25d366", color: "#fff", padding: "6px 16px", borderRadius: 50, fontSize: 13, fontWeight: 800, textDecoration: "none" }}>
                  💬 WhatsApp
                </a>
              </div>
              <div style={{ marginTop: 8 }}>📍 #115, Kammanahalli RS Palya,<br />Bengaluru – 560033</div>
              <div style={{ marginTop: 8 }}>
                <a href="https://maps.google.com/?q=Kammanahalli+RS+Palya+Bangalore+560033" target="_blank" rel="noopener noreferrer"
                  style={{ color: "#FFE97A", fontWeight: 700, fontSize: 13 }}>📍 Open in Google Maps →</a>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.25)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
            © 2024 Style by Kenisha · stylebykenisha.shop · Made with 💕
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {["🌸 Kids Frocks", "👶 Baby Wear", "✨ Toddler Outfits"].map(t => (
              <span key={t} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 50, padding: "4px 12px", fontSize: 12 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
