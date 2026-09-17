import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../api/orders";

export default function Cart() {
  const { cart, fetchCart, remove } = useCart();
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "",
    address: "", city: "", postal_code: "", province: "", notes: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const handleCheckout = async () => {
    try {
      await createOrder(form);
      setMessage("¡Orden creada con éxito!");
      setShowForm(false);
      fetchCart();
    } catch (err) {
      const detail = err.response?.data?.error || "Error al crear la orden";
      setMessage(detail);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="pt-32 pb-[120px] min-h-screen">
        <div className="max-w-[1280px] mx-auto px-6 text-center py-24">
          <span className="material-symbols-outlined text-6xl text-outline mb-6">shopping_bag</span>
          <p className="font-body-lg text-on-surface-variant mb-8">Tu carrito está vacío.</p>
          <Link to="/" className="inline-block bg-[#333333] text-white px-10 py-4 text-xs uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity">
            Explorar Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-[120px] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6">
        <h1 className="font-display-lg text-4xl md:text-5xl mb-12">Tu Carrito</h1>

        <div className="space-y-6">
          {cart.items.map((item, i) => (
            <div key={i} className="flex gap-6 items-center border-b border-outline-variant/30 pb-6">
              <div className="w-24 h-24 bg-surface-container-low overflow-hidden flex-shrink-0">
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-headline-md text-lg mb-1">
                  {item.name}
                  {item.size && <span className="text-on-surface-variant font-body-md text-sm"> - Talle {item.size}</span>}
                </h3>
                <p className="font-body-md text-on-surface-variant text-sm">Cantidad: {item.quantity}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-headline-md text-lg mb-2">${item.total_price}</p>
                <button
                  onClick={() => remove(item.product_id, item.size)}
                  className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant hover:text-red-500 transition-colors cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="font-body-md text-on-surface-variant">Total de productos: {cart.total_items}</p>
            <p className="font-headline-lg text-2xl font-bold mt-2">Total: ${cart.total_price}</p>
          </div>
          <div className="flex gap-4">
            <Link to="/" className="px-8 py-4 border border-[#333333] text-[#333333] text-xs uppercase tracking-widest rounded-sm hover:bg-[#333333] hover:text-white transition-all">
              Seguir Comprando
            </Link>
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-4 bg-[#333333] text-white text-xs uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity cursor-pointer"
            >
              Finalizar Compra
            </button>
          </div>
        </div>

        {message && (
          <div className="mt-8 p-4 bg-tertiary-container text-on-tertiary-container rounded-lg text-center">
            {message}
          </div>
        )}

        {showForm && (
          <div className="mt-12 max-w-2xl mx-auto">
            <h2 className="font-headline-lg text-2xl mb-8">Datos de envío</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(form).map(([key, val]) => (
                key === "notes" ? null : (
                  <div key={key} className={key === "address" ? "md:col-span-2" : ""}>
                    <label className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant block mb-2">
                      {key.replace(/_/g, " ")}
                    </label>
                    <input
                      value={val}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full bg-transparent border-b border-on-surface py-3 px-2 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                )
              ))}
            </div>
            <button
              onClick={handleCheckout}
              className="mt-8 w-full py-5 bg-inverse-surface text-inverse-on-surface text-xs uppercase tracking-[0.2em] rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
            >
              Confirmar y Pagar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
