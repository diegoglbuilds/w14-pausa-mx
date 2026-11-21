'use client';
import { useEffect, useRef } from 'react';
import { logCampaignEvent } from '@/lib/campaign-analytics';

const assets = [
  { id: 'A1', series: 'A', name: 'Antes de comprar', format: 'Tarjeta cuadrada', hook: 'MX$999 x 12 looks small. ¿Qué más cae ese mes?', question: '¿Qué otros pagos coinciden ese mes?', cta: 'Haz el Quick Check', finished: true },
  { id: 'B1', series: 'B', name: 'Lo que falta en checkout', format: 'Historia vertical · 3 paneles', hook: 'Checkout te muestra la venta. Pausa MX te muestra lo que falta.', question: '¿Qué fechas y cargos no aparecen en la mensualidad?', cta: 'Ver el ejemplo', finished: true },
  { id: 'C1', series: 'C', name: 'Haz la cuenta conmigo', format: 'Bloque interactivo', hook: 'Compra: MX$6,000. 6 pagos. ¿Qué cambia?', question: '¿Qué cambia al mirar el total y las fechas?', cta: 'Prueba con tus números', finished: true },
  { id: 'A2', series: 'A', name: 'Antes de comprar', format: 'Historia/reel vertical', hook: 'El pago mensual no es toda la decisión.', finished: false },
  { id: 'B2', series: 'B', name: 'Lo que falta en checkout', format: 'Tarjeta comparativa', hook: '¿Y si cae en la misma quincena que tus otros pagos?', finished: false },
  { id: 'C2', series: 'C', name: 'Haz la cuenta conmigo', format: 'Comparación lado a lado', hook: 'Dos compras, mismo pago mensual. ¿Misma decisión?', finished: false },
] as const;

function CampaignCta({ assetId, seriesId, label, destination }: { assetId: 'A1'|'B1'|'C1'; seriesId: 'A'|'B'|'C'; label: string; destination?: string }) {
  function click() {
    logCampaignEvent('campaign_cta_clicked', 'launch', seriesId, assetId);
    if (!destination) logCampaignEvent('quick_check_from_campaign_started', 'quick-check', seriesId, assetId);
  }
  return <a className="btn small" href={destination ?? `/?campaign=1&series=${seriesId}&asset=${assetId}#quick-check`} onClick={click}>{label}</a>;
}

export default function LaunchClient() {
  const viewed = useRef(false);
  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    logCampaignEvent('venture_page_viewed', 'launch');
    if (typeof IntersectionObserver === 'undefined') return;
    const observed = new Set<string>();
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target as HTMLElement;
      const asset = element.dataset.testid?.replace('asset-', '');
      const series = asset?.slice(0, 1);
      if (asset && series && !observed.has(asset)) {
        observed.add(asset);
        logCampaignEvent('campaign_asset_viewed', 'launch', series, asset);
      }
    }), { threshold: 0.25 });
    document.querySelectorAll<HTMLElement>('[data-testid^="asset-"]').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return <>
    <header className="site-header"><div className="wrap" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><a className="brand" href="/"><span className="brand-mark">Ⅱ</span>Pausa MX</a><nav className="nav"><a href="/">Quick Check</a><a href="/pricing">Planes</a><a href="/about">Nuestra idea</a></nav></div></header>
    <main className="wrap launch-page">
      <section className="hero launch-hero"><span className="eyebrow">Semana 15 · Distribución</span><h1>Tu método alimenta a tu audiencia.</h1><p><strong>Pausa MX is a pre-checkout decision tool for Mexican online shoppers considering installment purchases.</strong></p><p>Audiencia: personas en México que consideran pagar una compra en mensualidades. Momento: ven un pago mensual que parece manejable y aún no han reconstruido cómo coincide con otros compromisos.</p><h2 className="launch-promise">See the consequence before checkout.</h2><p className="quiet">Promesa acotada: hacemos visible la información conocida y lo que falta. Pausa MX no decide si debes comprar.</p></section>
      <section className="section"><div className="section-heading"><h2>Un método reconocible</h2><p>Situación de compra → número o consecuencia visible → una pregunta pendiente → Pausa MX Check → siguiente paso acotado.</p></div><div className="campaign-grid">{assets.filter(a=>a.finished).map(a=><article className={`campaign-card campaign-${a.id}`} key={a.id} data-testid={`asset-${a.id}`}><div className="campaign-top"><span className="eyebrow">Serie {a.series} · {a.name}</span><span className="format-label">{a.format}</span></div><p className="campaign-hook">{a.hook}</p><div className="campaign-detail"><span>La pregunta que falta</span><strong>{a.question}</strong></div><p className="campaign-check"><b>Pausa MX check</b><br/>Revisa pagos, fechas e incertidumbres que tú conoces. Los supuestos pueden cambiar.</p>{a.id==='B1'&&<div className="story-panels"><span>1 · La mensualidad visible</span><span>2 · La fecha y otros pagos</span><span>3 · Lo conocido y lo incierto</span></div>}{a.id==='C1'&&<div className="interactive-demo"><span>Ejemplo editable en Quick Check</span><b>6 pagos × MX$1,000 = MX$6,000</b><small>Ejemplo ilustrativo; no incluye cargos desconocidos.</small></div>}<CampaignCta assetId={a.id} seriesId={a.series} label={a.cta}/></article>)}</div></section>
      <section className="section"><div className="section-heading"><h2>Tres conceptos por desarrollar</h2><p>Sketches, no piezas publicadas ni resultados probados.</p></div><div className="sketch-grid">{assets.filter(a=>!a.finished).map(a=><article className="card sketch-card" key={a.id} data-testid={`sketch-${a.id}`}><span className="hypothesis">SKETCH / CONCEPT</span><h3>{a.id} · Serie {a.series}</h3><p>{a.name} · {a.format}</p><strong>{a.hook}</strong><p className="quiet">Borrador pendiente de producción, revisión y aprobación humana.</p></article>)}</div></section>
      <section className="panel method-panel"><div className="section-heading"><h2>Proceso creativo y controles</h2><p>La IA puede ayudar a producir; nunca publica automáticamente.</p></div><ol className="process-list">{[
        ['Research','Situación de compra','Escenario concreto','¿Es realista y está etiquetado?'],['Writing','Escenario + verdad del producto','Gancho, cuerpo y CTA','¿Cada afirmación es defendible?'],['Visual production','Copy revisado','Pieza visual','¿Muestra una consecuencia y la pregunta pendiente?'],['Evidence / claim check','Borrador','Afirmaciones aprobadas o rechazadas','¿Hay un resultado inventado o falsa certeza?'],['Style review','Pieza verificada','Versión concreta y calmada','¿Es concreta, calmada y acotada?'],['Human approval · REQUIRED','Versión final','Aprobar o pedir cambios','Una persona debe aprobar antes de publicar.'],['Publish / share','Pieza aprobada','Compartir manualmente','¿El destino y el contexto siguen siendo adecuados?'],['Observe response','Distribución real','Observación documentada','¿Se registró solo lo que ocurrió?'],['Revise','Observación real','Siguiente versión','¿La revisión responde a evidencia?'],
      ].map(([role,input,output,check])=><li key={role}><strong>{role}</strong><span><b>Input:</b> {input}</span><span><b>Output:</b> {output}</span><span><b>Quality check:</b> {check}</span></li>)}</ol><p className="approval-callout">PUBLICATION BLOCKED UNTIL HUMAN APPROVAL · No hay publicación automática.</p></section>
      <section className="section example-section"><div className="section-heading"><h2>Input → método → output</h2><p>Escenario inventado para demostrar el método; no es un caso de usuario.</p></div><div className="example-grid"><article className="card"><span className="eyebrow">Invented scenario · ilustrativo</span><h3>Input</h3><p>Compra: MX$11,988 total · 12 mensualidades · MX$999/mes.</p><small className="quiet">Los importes son ficticios y no representan una observación.</small></article><article className="card"><h3>Method</h3><p>Research → writing → visual → claim check → style review → human approval.</p></article><article className="card"><h3>Output</h3><p className="campaign-hook">“MX$999 x 12 looks small. ¿Qué más cae ese mes?”</p><p>Pausa MX does not approve or reject the purchase. It helps you see the commitment before checkout.</p><CampaignCta assetId="A1" seriesId="A" label="Haz el Quick Check"/></article></div></section>
      <section className="panel evidence-panel"><div className="section-heading"><h2>Distribución: resultados pendientes</h2><p><strong>Not tested yet.</strong> No se ha hecho una prueba con audiencia real.</p></div><p>Registrar solo después de compartir realmente. No hay métricas precargadas.</p><div className="pending-grid">{['Sent/shared to','Observable reach','Clicks/opens','Quick Check starts','Replies','Result','Keep/change'].map(x=><div key={x}><b>{x}</b><span>Pending · Not tested yet</span></div>)}</div><p className="honesty">Un clic registrado en este navegador indica una acción de clic; no es adopción, conversión, demanda ni prueba de engagement. Los eventos locales no observan alcance externo ni quién recibió una pieza.</p></section>
      <section className="panel safety-panel"><h2>Límites y evidencia</h2><p>Sin vergüenza, urgencia falsa, cuentas regresivas, testimonios inventados, promesas de prevenir deuda o ahorros fabricados. Ningún socio controla el mensaje. Incertidumbre visible; acción bajo control de quien compra; aprobación humana antes de publicar.</p><p><strong>Alcance actual:</strong> Quick Check multiplica el pago ingresado por el número de pagos y lo compara con el precio de contado. No reúne ni compara fechas de pago u otros compromisos; revísalos por separado. Cargos no ingresados siguen siendo desconocidos.</p><p><strong>Real:</strong> la página y los eventos de interacción guardados localmente en este navegador. <strong>Simulado:</strong> los tres ejemplos numéricos y el escenario inventado. <strong>Pendiente:</strong> respuestas de audiencia, alcance y resultados de distribución.</p></section>
    </main><footer className="site-footer"><div className="wrap footer-inner"><span>© Pausa MX · Semana 15</span><a href="/#quick-check">Abrir Quick Check</a></div></footer>
  </>;
}
