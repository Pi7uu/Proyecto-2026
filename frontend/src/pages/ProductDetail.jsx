import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProduct } from "../api/products";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { slug } = useParams();
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("6");
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    setLoading(true);
    getProduct(slug)
      .then(({ data }) => {
        setProduct(data);
        setMainImage(data.image_url);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-20">
        <p className="font-body-lg text-on-surface-variant">Cargando...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-20">
        <p className="font-body-lg text-on-surface-variant">Producto no encontrado</p>
      </div>
    );
  }

  const sizes = ["5", "6", "7", "8", "9"];
  const hasImages = product.images && product.images.length > 0;

  return (
    <div className="pt-12 pb-[120px]">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-7 flex flex-col gap-6">
          <div className="aspect-[4/5] overflow-hidden bg-surface-container-low">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-800 hover:scale-105"
            />
          </div>
          {hasImages && (
            <div className="flex gap-4 overflow-x-auto">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setMainImage(img.image_url)}
                  className={`w-20 h-20 flex-shrink-0 overflow-hidden border-2 transition-colors cursor-pointer ${
                    mainImage === img.image_url ? "border-on-surface" : "border-outline-variant"
                  }`}
                >
                  <img src={img.image_url} alt={img.alt_text} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-5 flex flex-col pt-4">
          <div className="mb-2 flex gap-2">
            <span className="inline-block px-3 py-1 bg-tertiary-container text-on-tertiary-container text-xs rounded-full uppercase tracking-widest font-label-sm">
              925 Sterling
            </span>
            {product.is_limited_edition && (
              <span className="inline-block px-3 py-1 bg-tertiary-container text-on-tertiary-container text-xs rounded-full uppercase tracking-widest font-label-sm">
                Edición Limitada
              </span>
            )}
          </div>
          <h1 className="font-headline-lg text-[40px] text-on-surface mb-2">{product.name}</h1>
          <p className="font-body-md text-on-surface-variant mb-6 italic">Material: {product.material}</p>
          <div className="font-headline-md text-[28px] text-on-surface mb-8">${product.price}</div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant">
                Seleccionar Talla
              </span>
              <span className="text-xs underline underline-offset-4 decoration-outline-variant text-on-surface-variant">
                Guía de tallas
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 flex items-center justify-center font-body-md transition-colors cursor-pointer ${
                    selectedSize === size
                      ? "border border-primary bg-surface-container-highest font-bold"
                      : "border border-outline-variant hover:border-primary"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 mb-10">
            <button className="w-full py-5 bg-inverse-surface text-inverse-on-surface text-xs uppercase tracking-[0.2em] rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
              Comprar Ahora
            </button>
            <button
              onClick={() => add(product.id, { size: selectedSize })}
              className="w-full py-5 border border-inverse-surface text-inverse-surface text-xs uppercase tracking-[0.2em] rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
            >
              Añadir al Carrito
            </button>
          </div>

          {[
            { title: "Descripción", content: product.description },
            { title: "Envíos y Devoluciones", content: "Envío gratuito en todos los pedidos superiores a $150. Las devoluciones se aceptan dentro de los 30 días posteriores a la recepción, siempre que el producto se encuentre en su estado y embalaje original." },
            { title: "Cuidado de la Joya", content: "Evite el contacto con perfumes y productos químicos. Limpie suavemente con el paño de pulido incluido en su pedido para mantener el brillo radiante de la plata." },
          ].map((section) => (
            <AccordionSection key={section.title} title={section.title} content={section.content} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AccordionSection({ title, content }) {
  const [open, setOpen] = useState(title === "Descripción");
  return (
    <div className="border-t border-outline-variant/30 py-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center cursor-pointer"
      >
        <span className="font-label-sm text-xs uppercase tracking-widest">{title}</span>
        <span className={`material-symbols-outlined transition-transform ${open ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </button>
      {open && <div className="mt-4 text-on-surface-variant font-body-md leading-relaxed">{content}</div>}
    </div>
  );
}
