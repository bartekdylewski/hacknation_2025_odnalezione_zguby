import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Header = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Strona Główna' },
    { path: '/dane', label: 'Dane' },
    { path: '/formularz', label: 'Formularz' },
    { path: '/kod-osobisty', label: 'Kod Osobisty' },
    { path: '/informacje', label: 'Informacje' },
    { path: '/wydawanie', label: 'Wydawanie' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50" role="banner">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
      >
        Przeskocz do treści głównej
      </a>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-blue-700">
              <Link to="/" aria-label="Strona główna znalezione.gov.pl">
                znalezione.gov.pl
              </Link>
            </h1>
            <p className="text-gray-600 text-sm mt-1 hidden sm:block">
              Centralna Baza Rzeczy Znalezionych
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {isAuthenticated && (
              <div className="hidden sm:flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-4 h-4" aria-hidden="true" />
                  <span className="text-sm" aria-label={`Zalogowany jako ${currentUser?.username}`}>
                    {currentUser?.username}
                  </span>
                </div>
                <Button onClick={logout} variant="outline" size="sm" aria-label="Wyloguj się z systemu">
                  <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                  Wyloguj
                </Button>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-6" role="navigation" aria-label="Nawigacja główna">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`pb-2 border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded ${
                isActive(link.path)
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
              aria-current={isActive(link.path) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav
            id="mobile-menu"
            className="lg:hidden mt-4 pb-4 border-t pt-4"
            role="navigation"
            aria-label="Nawigacja mobilna"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={handleLinkClick}
                  className={`px-4 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    isActive(link.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <div className="border-t pt-3 mt-2 sm:hidden">
                    <div className="px-4 py-2 text-gray-600 text-sm flex items-center gap-2">
                      <User className="w-4 h-4" aria-hidden="true" />
                      <span aria-label={`Zalogowany jako ${currentUser?.username}`}>
                        {currentUser?.username}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      logout();
                      handleLinkClick();
                    }}
                    variant="outline"
                    className="sm:hidden mx-4"
                    aria-label="Wyloguj się z systemu"
                  >
                    <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                    Wyloguj
                  </Button>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};