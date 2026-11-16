import {afterEach,it,expect} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import QuickCheck from './quick-check';
afterEach(cleanup);
it('rejects empty numeric inputs instead of silently treating them as zero',()=>{render(<QuickCheck/>);fireEvent.change(screen.getByLabelText('Precio de contado (MXN)'),{target:{value:''}});fireEvent.click(screen.getByRole('button',{name:'Comparar mi compra'}));expect(screen.getByRole('alert')).toBeInTheDocument();expect(screen.queryByText('Tu comparación')).not.toBeInTheDocument();});
