"use client";
import { useCart } from "../context/CartContext";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, removeFromCart, updateQty, totalPrice } = useCart();

  const handleWhatsApp = () => {
    let msg = "Hi Style by Kenisha! 👋 I'd like to order:\n\n";
    cart.forEach(({ product, qty }) => {
      msg += `• ${product.name} – ₹${product.price} × ${qty}\n`;
    });
    msg += `\n💰 Total: ₹${totalPrice.toLocaleString()}\n\nPlease confirm availability. Thank you! 🌸`;
    window.open(`https://wa.me/916361360153?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "fixed", right: 0, top: 0, bottom: 0, width: 380,
        background: "#FFF9F5", zIndex: 201,
        display: "flex", flexDirection: "column",
        boxShadow: "-8px 0 32px rgba(255,107,157,0.2)",
        borderLeft: "3px solid #FFB5C8",
      }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #FF6B9D, #9B72F5)", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 22, color: "#fff" }}>🛒 My Cart</div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>{cart.length} item{cart.length !== 1 ? "s" : ""} inside</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🛍️</div>
              <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 22, color: "#FF6B9D", marginBottom: 8 }}>Cart is Empty!</div>
              <div style={{ color: "#aaa", fontSize: 14 }}>Add some cute outfits 💕</div>
            </div>
          ) : (
            cart.map(({ product, qty }) => (
              <div key={product.id} style={{
                background: "#fff", borderRadius: 16, padding: 14, marginBottom: 12,
                display: "flex", gap: 12, alignItems: "center",
                border: "2px solid #FFE0EE", boxShadow: "0 2px 8px rgba(255,107,157,0.08)",
              }}>
                <div style={{ width: 60, height: 60, borderRadius: 12, overflow: "hidden", flexShrink: 0, background: "#FFF0F5" }}>
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>👗</div>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: "#2D2D2D", marginBottom: 2 }}>{product.name}</div>
                  <div style={{ color: "#FF6B9D", fontWeight: 800, fontSize: 15 }}>₹{product.price}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                    <button onClick={() => updateQty(product.id!, qty - 1)} style={{ background: "#FFB5C8", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", fontWeight: 900, color: "#fff" }}>−</button>
                    <span style={{ fontWeight: 800, fontSize: 14 }}>{qty}</span>
                    <button onClick={() => updateQty(product.id!, qty + 1)} style={{ background: "#FF6B9D", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", fontWeight: 900, color: "#fff" }}>+</button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(product.id!)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#ddd" }}>✕</button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: "20px 24px", borderTop: "2px solid #FFE0EE" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: 18, fontWeight: 900 }}>
              <span>Total:</span>
              <span style={{ color: "#FF6B9D" }}>₹{totalPrice.toLocaleString()}</span>
            </div>
            <button onClick={handleWhatsApp} style={{
              width: "100%", background: "#25d366", color: "#fff", border: "none",
              padding: 14, borderRadius: 50, fontWeight: 800, fontSize: 16,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 4px 16px rgba(37,211,102,0.4)",
            }}>
              💬 Order on WhatsApp
            </button>
            <p style={{ textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 10 }}>
              📞 6361360153 · We confirm & deliver within Bengaluru
            </p>
          </div>
        )}
      </div>
    </>
  );
}
