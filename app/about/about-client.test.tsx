import {afterEach,it,expect} from 'vitest';
import {cleanup,render,screen} from '@testing-library/react';
import AboutClient from './about-client';
afterEach(cleanup);
it('shows the unverified 10:1 caveats',()=>{render(<AboutClient/>);expect(screen.getByText(/no afirmamos que la relación 10:1 esté probada/i)).toBeInTheDocument();for(const claim of ['Tiempo realmente ahorrado','Uso repetido','Disposición a pagar','Conversión a un plan pagado','Frecuencia de errores evitados','Disposición de socios a pagar'])expect(screen.getByText(claim)).toBeInTheDocument();});
