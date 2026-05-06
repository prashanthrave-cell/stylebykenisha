"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProduct, Product } from "../../../../lib/productService";
import ProductForm from "../../../components/ProductForm";

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduct(id as string).then(setProduct).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F4FF" }}>
      <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 24, color: "#9B72F5" }}>🌸 Loading...</div>
    </div>
  );

  if (!product) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F4FF" }}>
      <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 24, color: "#FF4444" }}>Product not found</div>
    </div>
  );

  return <ProductForm product={product} />;
}
