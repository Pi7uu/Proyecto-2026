import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../api/products";
import { subscribeNewsletter } from "../api/newsletter";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const currentCategory = searchParams.get("category");

  useEffect(() => {
    setLoading(true);
    getProducts({ category: currentCategory || undefined })
      .then(({ data }) => {
        setProducts(data.results);
        setTotalCount(data.count);
      })
      .finally(() => setLoading(false));
  }, [currentCategory]);

  const categories = [
    { name: "Todos los productos", slug: null },
    { name: "Anillos", slug: "anillos" },
    { name: "Collares", slug: "collares" },
    { name: "Aros", slug: "aros" },
    { name: "Tobilleras", slug: "tobilleras" },
    { name: "Dijes", slug: "dijes" },
  ];

  return (
    <div>
      <section className="relative h-[870px] w-full overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-[#333333] to-[#1a1c1c]" />
          <div className="absolute inset-0 bg-black/10" />
        </div>
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 w-full">
          <div className="max-w-2xl text-white">
            <span className="text-xs uppercase tracking-[0.3em] mb-6 block text-surface-bright font-label-sm">
              Colección Esencial
            </span>
            <h1 className="font-display-lg text-6xl md:text-8xl mb-8 leading-[1.1]">
              Elegancia en <br />Plata Pura.
            </h1>
            <p className="font-body-lg text-body-lg mb-10 text-surface-container-low max-w-lg">
              Piezas talladas a mano en plata esterlina 925, diseñadas para perdurar y brillar en cada momento de tu historia.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-[#333333] text-white px-10 py-4 text-xs uppercase tracking-widest rounded-sm hover:bg-on-background transition-colors cursor-pointer"
              >
                Explorar Todo
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-6 mt-24 mb-12" id="productos">
        <div className="flex flex-wrap gap-x-12 gap-y-4 border-b border-outline-variant/30 pb-6 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.slug || "all"}
              onClick={() => setSearchParams(cat.slug ? { category: cat.slug } : {})}
              className={`font-label-sm text-xs uppercase tracking-widest pb-5 -mb-6 relative z-10 transition-colors cursor-pointer ${
                (cat.slug === null && !currentCategory) || cat.slug === currentCategory
                  ? "text-on-surface font-bold border-b-2 border-on-background"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <section className="max-w-[1280px] mx-auto px-6 pb-[120px]">
        {loading ? (
          <p className="text-center py-20 font-body-lg text-on-surface-variant">Cargando productos...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {products.length === 0 && (
              <p className="text-center py-20 font-body-lg text-on-surface-variant">
                No hay productos en esta categoría.
              </p>
            )}
            {products.length < totalCount && (
              <div className="mt-24 flex flex-col items-center gap-6">
                <div className="h-[0.5px] bg-[#E2E2E2] w-4/5 mx-auto" />
                <button className="px-12 py-4 border border-[#333333] text-[#333333] text-xs uppercase tracking-widest hover:bg-[#333333] hover:text-white transition-all duration-300 cursor-pointer">
                  Cargar Más Diseños
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <section className="bg-surface-container-low py-[120px]">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: "verified", title: "Plata Certificada", desc: "Cada una de nuestras piezas está sellada con el timbre 925, garantizando la pureza y calidad de los metales utilizados." },
            { icon: "auto_awesome", title: "Brillo Duradero", desc: "Nuestras joyas reciben un tratamiento especial anti-deslustre para que mantengan su esplendor original por mucho más tiempo." },
            { icon: "local_shipping", title: "Envíos Asegurados", desc: "Recibe tus tesoros en la comodidad de tu hogar con empaques premium diseñados para proteger la integridad de cada pieza." },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-4xl mb-6 text-primary">{item.icon}</span>
              <h4 className="font-headline-md text-xl mb-4">{item.title}</h4>
              <p className="text-on-surface-variant">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-[120px] bg-surface">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display-lg text-4xl md:text-5xl mb-6">Únete al Círculo Lumina.</h2>
          <p className="font-body-lg text-on-surface-variant mb-12">
            Recibe acceso anticipado a nuevas colecciones y consejos exclusivos sobre el cuidado de tus joyas.
          </p>
          <form
            className="flex flex-col md:flex-row gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const { data } = await subscribeNewsletter(newsletterEmail);
                setNewsletterMessage(data.message || "¡Suscripción exitosa!");
                setNewsletterEmail("");
              } catch {
                setNewsletterMessage("No pudimos completar tu suscripción. Intentá de nuevo.");
              }
            }}
          >
            <input
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 bg-transparent border-b border-on-surface py-4 px-2 focus:outline-none placeholder:text-outline focus:border-primary transition-colors"
              placeholder="TU CORREO ELECTRÓNICO"
              type="email"
              required
            />
            <button type="submit" className="bg-[#333333] text-white px-12 py-4 text-xs uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer">
              Suscribirme
            </button>
          </form>
          {newsletterMessage && (
            <p className="mt-6 font-body-md text-on-surface-variant">{newsletterMessage}</p>
          )}
        </div>
      </section>
    </div>
  );
}
