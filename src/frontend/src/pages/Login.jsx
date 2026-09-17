import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser, checkAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(form);
      setUser(data);
      await checkAuth();
      navigate("/");
    } catch {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="w-full max-w-md px-6">
        <h1 className="font-display-lg text-4xl text-center mb-2">Bienvenido</h1>
        <p className="font-body-md text-on-surface-variant text-center mb-12">Ingresá a tu cuenta</p>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-lg text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant block mb-2">Usuario</label>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full bg-transparent border-b border-on-surface py-3 px-2 focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>
          <div>
            <label className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant block mb-2">Contraseña</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-transparent border-b border-on-surface py-3 px-2 focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-5 bg-inverse-surface text-inverse-on-surface text-xs uppercase tracking-[0.2em] rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            Ingresar
          </button>
        </form>

        <p className="text-center mt-8 font-body-md text-on-surface-variant">
          ¿No tenés cuenta?{" "}
          <Link to="/register" className="underline underline-offset-4 decoration-outline-variant hover:decoration-primary transition-all">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
