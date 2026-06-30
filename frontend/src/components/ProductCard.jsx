import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { add } = useCart();

  return (
    <Link to={`/producto/${product.slug}`} className="group block">
      <div className="relative overflow-hidden bg-[#F5F5F5] aspect-[3/4] mb-6 border border-[#E2E2E2]/30">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {product.is_limited_edition && (
          <div className="absolute top-4 left-4">
            <span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 text-[10px] uppercase tracking-widest rounded-full">
              Edición Limitada
            </span>
          </div>
        )}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
          onClick={(e) => {
            e.preventDefault();
            add(product.id, {});
          }}
        >
          <button className="w-full bg-[#333333] text-white py-3 text-xs uppercase tracking-widest cursor-pointer">
            Agregar al Carrito
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-[0.2em] text-outline font-label-sm">
          {product.category_display}
        </span>
        <h3 className="font-headline-md text-lg text-on-surface">{product.name}</h3>
        <p className="font-body-md text-sm text-on-surface-variant">${product.price}</p>
      </div>
    </Link>
  );
}
