import React, { FormEvent, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Droplets, Mail, MessageCircle, PaintBucket, ShieldCheck } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import './styles.css';
import './overrides.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

function App() {
  const [status, setStatus] = useState('');

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('Enviando...');
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      phone: String(form.get('phone') || ''),
      company: String(form.get('company') || ''),
      customer_type: String(form.get('customer_type') || 'distribuidor'),
      consent: form.get('consent') === 'on',
      source: 'website',
      status: 'active',
    };

    if (!supabase) {
      setStatus('Falta configurar Supabase en Render.');
      return;
    }

    const { error } = await supabase.from('subscribers').insert(payload);
    if (error) {
      setStatus(error.code === '23505' ? 'Este correo ya está registrado.' : 'No fue posible completar el registro.');
      return;
    }
    setStatus('Registro confirmado. Te enviaremos la lista de precios.');
    event.currentTarget.reset();
  }

  return (
    <>
      <header className="topbar">
        <a href="#inicio" className="brand logo-link" aria-label="NAREK, la solución profesional">
          <img src="/images/narek-logo.png" alt="NAREK" className="brand-logo" />
        </a>
        <nav><a href="#productos">Productos</a><a href="#promociones">Promociones</a><a href="#precios">Lista de precios</a><a href="#contacto">Contacto</a></nav>
        <a className="button small" href="#precios">Suscribirme</a>
      </header>

      <main>
        <section id="inicio" className="hero single-hero">
          <img src="/images/nare-colores.png" alt="Carta de colores NAREK y pintor profesional" className="hero-image active" />
          <div className="hero-shade" />
          <div className="hero-copy">
            <span className="eyebrow">Pinturas y recubrimientos profesionales</span>
            <h1>Si el día no pinta bien, <strong>píntalo tú.</strong></h1>
            <p>Soluciones para proteger, impermeabilizar, decorar y señalizar.</p>
            <div className="actions"><a className="button" href="#productos">Conocer productos</a><a className="button outline" href="#precios">Obtener precios</a></div>
          </div>
        </section>

        <section id="productos" className="section">
          <div className="section-heading"><span>Soluciones NAREK</span><h2>Una línea para cada necesidad</h2></div>
          <div className="cards">
            <article><PaintBucket /><h3>Pinturas vinílicas</h3><p>Acabados interiores y exteriores con gran rendimiento.</p></article>
            <article><ShieldCheck /><h3>Selladores y adhesivos</h3><p>Preparación profesional para superficies firmes y duraderas.</p></article>
            <article className="product-card impermeabilizante-card"><img src="/images/narek-impermeabilizante.png" alt="Cubeta de impermeabilizante acrílico elastomérico NAREK" className="product-image" /><Droplets /><h3>Impermeabilizantes</h3><p>Protección contra humedad y filtraciones.</p></article>
            <article><PaintBucket /><h3>Esmaltes y primarios</h3><p>Protección y acabado para metal, madera y señalización.</p></article>
          </div>
        </section>

        <section id="promociones" className="promo section">
          <div><span className="eyebrow dark">Promociones del mes</span><h2>Beneficios especiales para profesionales y distribuidores</h2><p>Consulta disponibilidad, vigencia y condiciones directamente por WhatsApp.</p><a className="button" href="https://wa.me/522292412530?text=Hola%2C%20vi%20las%20promociones%20de%20NAREK%20y%20deseo%20m%C3%A1s%20informaci%C3%B3n" target="_blank" rel="noreferrer">Ver promociones</a></div>
          <div className="promo-box">Próxima promoción</div>
        </section>

        <section id="precios" className="signup section">
          <div><span className="eyebrow dark">Acceso exclusivo</span><h2>Obtén la lista de precios</h2><p>Regístrate para recibir precios vigentes y novedades comerciales de NAREK.</p></div>
          <form onSubmit={subscribe}>
            <input required name="name" placeholder="Nombre completo" />
            <input required type="email" name="email" placeholder="Correo electrónico" />
            <input required name="phone" placeholder="Teléfono o WhatsApp" />
            <input name="company" placeholder="Empresa o negocio" />
            <select name="customer_type" defaultValue="distribuidor"><option value="distribuidor">Distribuidor</option><option value="constructor">Constructor</option><option value="pintor">Pintor</option><option value="comercio">Comercio</option><option value="otro">Otro</option></select>
            <label className="consent"><input required type="checkbox" name="consent" /> Acepto recibir información comercial y la lista de precios.</label>
            <button className="button" type="submit">Solicitar lista</button>
            <p className="status" aria-live="polite">{status}</p>
          </form>
        </section>
      </main>

      <footer id="contacto">
        <div className="footer-logo-wrap"><img src="/images/narek-logo.png" alt="NAREK" className="footer-logo" /></div>
        <div><strong>Contacto</strong><a href="tel:+522292412530">229 241 2530</a><a href="mailto:asesoriahga@hotmail.com"><Mail size={16}/> asesoriahga@hotmail.com</a></div>
        <div><strong>Ubicación</strong><p>Av. Arrayanes, lote 7-A, manzana II<br/>Zona Ciudad Industrial Bruno Pagliai</p></div>
      </footer>

      <a className="whatsapp" href="https://wa.me/522292412530?text=Hola%2C%20vi%20la%20p%C3%A1gina%20de%20NAREK%20y%20deseo%20informaci%C3%B3n" target="_blank" rel="noreferrer" aria-label="Contactar por WhatsApp"><MessageCircle /></a>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
