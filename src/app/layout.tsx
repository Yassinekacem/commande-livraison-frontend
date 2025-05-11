import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '../components/Sidebar'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gestion Clients/Produits',
  description: 'Application de gestion des clients et produits',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-8"> 
          <ToastContainer />
            {children} 

          </div>
        </div>
      </body>
    </html>
  );
}