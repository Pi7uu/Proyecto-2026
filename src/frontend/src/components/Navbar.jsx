import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const categories = [
  { name: "Anillos", slug: "anillos" },
  { name: "Collares", slug: "collares" },
  { name: "Aros", slug: "aros" },
  { name: "Tobilleras", slug: "tobilleras" },
  { name: "Dijes", slug: "dijes" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30">
      <div className="max-w-[1280px] mx-auto flex justify-between items-center h-20 px-6">
        <div className="flex items-center gap-12">
          <Link to="/" className="font-display-lg text-2xl tracking-tighter text-on-surface">
            LUMINA SILVER
          </Link>
          <div className="hidden md:flex gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/?category=${cat.slug}`}
                className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/orders" className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant hover:text-on-surface">
                Mis Órdenes
              </Link>
              <button onClick={logout} className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant hover:text-on-surface">
                Salir
              </button>
            </div>
          ) : (
            <Link to="/login" className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant hover:text-on-surface">
              Ingresar
            </Link>
          )}
          <Link to="/cart" className="relative">
            <span className="material-symbols-outlined text-2xl">shopping_bag</span>
            {cart.total_items > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">
                {cart.total_items}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
