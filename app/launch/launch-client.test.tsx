import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import LaunchClient from './launch-client';
import { CAMPAIGN_ANALYTICS_KEY } from '@/lib/campaign-analytics';
beforeEach(() => { localStorage.clear(); sessionStorage.clear(); }); afterEach(cleanup);
describe('Week 15 distribution route', () => {
  it('shows audience, positioning, promise, boundary, and no forbidden promise', () => {
    render(<LaunchClient/>); expect(screen.getByText(/Mexican online shoppers considering installment purchases/)).toBeInTheDocument(); expect(screen.getByText('See the consequence before checkout.')).toBeInTheDocument(); expect(screen.getByRole('heading',{name:'AI-simulated audience testing'})).toBeInTheDocument(); expect(screen.getByText(/No se ha hecho una prueba con audiencia real/)).toBeInTheDocument(); expect(screen.getByText(/Real:/)).toBeInTheDocument(); expect(screen.queryByText(/prevents debt|guarantees affordability|saves a specific amount/i)).not.toBeInTheDocument();
  });
  it('renders A1, B1, C1 and labels A2, B2, C2 as concepts', () => {
    render(<LaunchClient/>); expect(screen.getByTestId('asset-A1')).toHaveTextContent('MX$999 x 12 looks small. ¿Qué más cae ese mes?'); expect(screen.getByTestId('asset-B1')).toHaveTextContent('Checkout te muestra la venta. Pausa MX te muestra lo que falta.'); expect(screen.getByTestId('asset-C1')).toHaveTextContent('Compra: MX$6,000. 6 pagos. ¿Qué cambia?'); for(const id of ['A2','B2','C2']) expect(screen.getByTestId(`sketch-${id}`)).toHaveTextContent('SKETCH / CONCEPT');
  });
  it('labels the synthetic distribution review and presents a bounded three-input action', () => {
    render(<LaunchClient/>);
    expect(screen.getByRole('heading', { name: 'AI-simulated audience testing' })).toBeInTheDocument();
    expect(screen.getByTestId('asset-A1')).toHaveTextContent('MX$999 x 12 looks small. ¿Qué más cae ese mes?');
    expect(screen.getByTestId('asset-B1')).toHaveTextContent('Checkout te muestra la venta. Pausa MX te muestra lo que falta.');
    expect(screen.getByTestId('asset-B1')).toHaveTextContent('Revisa tu compra en 3 datos');
    expect(screen.getAllByText(/No tienes que armar un presupuesto completo/)).toHaveLength(3);
    expect(screen.getByText(/No reúne ni compara fechas de pago u otros compromisos/)).toBeInTheDocument();
    expect(screen.queryByText(/previene deuda|evita deuda|garantiza asequibilidad|garantiza que puedes pagar/i)).not.toBeInTheDocument();
    expect(screen.getAllByText(/Pending · Not tested yet/)).toHaveLength(7);
    expect(screen.queryByText(/(?:reach|clicks|opens|replies):\s*\d+/i)).not.toBeInTheDocument();
  });
  it('shows creative process, quality checks, and required human approval', () => {
    render(<LaunchClient/>); for(const role of ['Research','Writing','Visual production','Evidence / claim check','Style review','Human approval · REQUIRED','Publish / share','Observe response','Revise']) expect(screen.getByText(role)).toBeInTheDocument(); expect(screen.getByText(/No hay publicación automática/)).toBeInTheDocument();
  });
  it('states that the current Quick Check does not compare other payment dates or commitments', () => {
    render(<LaunchClient/>); expect(screen.getByText(/No reúne ni compara fechas de pago u otros compromisos/)).toBeInTheDocument();
  });
  it('links CTA to Quick Check and records click intent, not conversion', () => {
    render(<LaunchClient/>); const cta=screen.getByRole('link',{name:'Revisa tu compra en 3 datos'}); expect(cta).toHaveAttribute('href','/?campaign=1&series=B&asset=B1#quick-check'); document.addEventListener('click',event=>event.preventDefault(),{capture:true,once:true}); fireEvent.click(cta); const raw=localStorage.getItem(CAMPAIGN_ANALYTICS_KEY)!; expect(raw).toContain('campaign_cta_clicked'); expect(raw).toContain('quick_check_from_campaign_started'); expect(raw).not.toMatch(/conversion|adoption/);
  });
  it('leaves every distribution observation pending without fabricated counts', () => {
    render(<LaunchClient/>); expect(screen.getAllByText('Pending · Not tested yet')).toHaveLength(7); expect(screen.queryByText(/Reach: 0|Clicks: 0|Replies: 0/)).not.toBeInTheDocument();
  });
});
