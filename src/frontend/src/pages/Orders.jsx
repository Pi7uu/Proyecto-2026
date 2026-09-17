import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../api/orders";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then(({ data }) => setOrders(data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-[120px] min-h-screen">
        <div className="max-w-[1280px] mx-auto px-6 text-center py-24">
          <p className="font-body-lg text-on-surface-variant">Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-[120px] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6">
        <h1 className="font-display-lg text-4xl md:text-5xl mb-12">Mis Órdenes</h1>

        {orders.length === 0 ? (
          <div className="text-center py-24">
            <span className="material-symbols-outlined text-6xl text-outline mb-6">receipt_long</span>
            <p className="font-body-lg text-on-surface-variant mb-8">No tenés órdenes aún.</p>
            <Link to="/" className="inline-block bg-[#333333] text-white px-10 py-4 text-xs uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity">
              Explorar Productos
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border border-outline-variant/30 p-6 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-headline-md text-lg">Orden #{order.id}</p>
                    <p className="font-body-md text-sm text-on-surface-variant">
                      {new Date(order.created_at).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 text-xs rounded-full uppercase tracking-widest font-label-sm ${
                      order.status === "delivered" ? "bg-tertiary-container text-on-tertiary-container" :
                      order.status === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-surface-container-high text-on-surface"
                    }`}>
                      {order.status === "pending" && "Pendiente"}
                      {order.status === "paid" && "Pagado"}
                      {order.status === "shipped" && "Enviado"}
                      {order.status === "delivered" && "Entregado"}
                      {order.status === "cancelled" && "Cancelado"}
                    </span>
                    <p className="font-headline-md text-lg mt-2">${order.total}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-sm">
                      <div className="w-12 h-12 bg-surface-container-low overflow-hidden flex-shrink-0">
                        <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                      </div>
                      <span className="flex-1">{item.product_name} x{item.quantity}</span>
                      <span className="text-on-surface-variant">${item.total}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
