"use client"; 
import "./globals.css";
import { QueryClient, QueryClientProvider} from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css' ;
import {cn } from '@/lib/utils';
import { UserContextProvider } from '@/context/UserContext';

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="pt-Br">
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
        {children}
        </UserContextProvider>
        <ToastContainer/>
      </QueryClientProvider>
      
      </body>
    </html>
  );
}
