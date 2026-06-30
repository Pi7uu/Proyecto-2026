import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="py-[120px] bg-surface-container-low border-t border-outline-variant/20">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="flex flex-col gap-6">
          <Link to="/" className="font-display-lg text-2xl text-on-surface">LUMINA SILVER</Link>
          <p className="font-body-md text-on-surface-variant">
            Joyas que cuentan historias, diseñadas con alma y forjadas en la pureza de la plata 925.
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <h5 className="font-label-sm text-xs uppercase tracking-widest text-on-surface font-bold">Explorar</h5>
          <ul className="flex flex-col gap-3">
            <li><Link to="/" className="font-body-md text-on-surface-variant hover:text-primary transition-colors">Inicio</Link></li>
            <li><span className="font-body-md text-on-surface-variant">Guía de Tallas</span></li>
            <li><span className="font-body-md text-on-surface-variant">Cuidado de Joyas</span></li>
            <li><span className="font-body-md text-on-surface-variant">Envíos</span></li>
          </ul>
        </div>
        <div className="flex flex-col gap-6">
          <h5 className="font-label-sm text-xs uppercase tracking-widest text-on-surface font-bold">Servicio al Cliente</h5>
          <ul className="flex flex-col gap-3">
            <li><span className="font-body-md text-on-surface-variant">Términos y Condiciones</span></li>
            <li><span className="font-body-md text-on-surface-variant">Políticas de Devolución</span></li>
            <li><span className="font-body-md text-on-surface-variant">Preguntas Frecuentes</span></li>
          </ul>
        </div>
        <div className="flex flex-col gap-6">
          <h5 className="font-label-sm text-xs uppercase tracking-widest text-on-surface font-bold">Síguenos</h5>
          <div className="flex gap-4">
            <span className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant font-body-md text-on-surface-variant">IG</span>
            <span className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant font-body-md text-on-surface-variant">X</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
