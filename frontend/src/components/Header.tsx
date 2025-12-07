import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const isActivePath = (path: string) => location.pathname === path;

  const publicNavItems = [
    { path: '/', label: 'Strona główna' },
    { path: '/kod-osobisty', label: 'Kod osobisty' },
    { path: '/informacje', label: 'Informacje' },
    { path: '/dane', label: 'Dane otwarte' },
  ];

  const authNavItems = [
    { path: '/formularz', label: 'Dodaj przedmiot' },
    { path: '/wydawanie', label: 'Wydawanie' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50" role="banner">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-sm" aria-hidden="true">
                ZG
              </span>
            </div>
            <span className="text-lg text-gray-900">znalezione.gov.pl</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Nawigacja główna">
            {publicNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm transition-colors hover:text-blue-600 ${
                  isActivePath(item.path) ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated &&
              authNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm transition-colors hover:text-blue-600 ${
                    isActivePath(item.path) ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
          </nav>

          {/* Auth Button - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                Wyloguj
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  <LogIn className="w-4 h-4 mr-2" aria-hidden="true" />
                  Zaloguj jako urzędnik
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
            aria-label={mobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t" role="navigation" aria-label="Nawigacja mobilna">
            <div className="flex flex-col gap-4">
              {publicNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm transition-colors hover:text-blue-600 ${
                    isActivePath(item.path) ? 'text-blue-600' : 'text-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated &&
                authNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-sm transition-colors hover:text-blue-600 ${
                      isActivePath(item.path) ? 'text-blue-600' : 'text-gray-700'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              
              {/* Auth Button - Mobile */}
              <div className="pt-4 border-t">
                {isAuthenticated ? (
                  <Button onClick={() => { logout(); setMobileMenuOpen(false); }} variant="outline" size="sm" className="w-full">
                    <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                    Wyloguj
                  </Button>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      <LogIn className="w-4 h-4 mr-2" aria-hidden="true" />
                      Zaloguj jako urzędnik
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};