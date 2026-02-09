import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  RouterProvider,
} from "react-router-dom";
import { router } from './Routes/Routes.jsx';
import {HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './providers/AuthProvider.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
    <QueryClientProvider client={queryClient}>
        <HelmetProvider>
        <AuthProvider>
          <div className=''>
            <RouterProvider router={router} />
          </div>
        </AuthProvider>
        </HelmetProvider>
      </QueryClientProvider>
  </React.StrictMode>,
)
