import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Pausa MX — una pausa antes de comprar',description:'Entiende el costo real antes de decidir. La decisión sigue siendo tuya.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es-MX"><body>{children}</body></html>;}
