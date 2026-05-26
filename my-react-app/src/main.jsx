import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import RedirectPage from './RedirectPage.jsx'
import { ClerkProvider } from '@clerk/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
        <Routes>
          <Route path="/" element={<App />} />

          <Route path="/:code" element={<RedirectPage />} />
        </Routes>
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>,
)
