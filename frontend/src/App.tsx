import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { FormularzPage } from './pages/FormularzPage';
import { KodOsobistyPage } from './pages/KodOsobistyPage';
import { InformacjePage } from './pages/InformacjePage';
import { WydawaniePage } from './pages/WydawaniePage';
import { DaneGovPage } from './pages/DaneGovPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main id="main-content" className="flex-1" role="main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dane" element={<DaneGovPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/formularz" element={<FormularzPage />} />
              <Route path="/kod-osobisty" element={<KodOsobistyPage />} />
              <Route path="/informacje" element={<InformacjePage />} />
              <Route path="/wydawanie" element={<WydawaniePage />} />
            </Routes>
          </main>
          <footer className="bg-white border-t border-gray-200 mt-auto" role="contentinfo">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <p className="text-sm text-gray-600 text-center">
                © 2024 znalezione.gov.pl - Centralna Baza Rzeczy Znalezionych
              </p>
              <p className="text-xs text-gray-500 text-center mt-2">
                Strona spełnia wymagania WCAG 2.1 poziomu AA
              </p>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}