import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { KeyRound, Info, Database, Shield } from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-blue-700 mb-4">
          System Zarządzania Znalezionymi Rzeczami
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Znalezione.gov.pl to centralny system dla administracji publicznej do zarządzania
          znalezionymi przedmiotami. Bezpieczne, zgodne z WCAG 2.1 i łatwe w użyciu.
        </p>
      </div>

      {/* Main Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <KeyRound className="w-6 h-6 text-green-600" aria-hidden="true" />
            </div>
            <CardTitle className="text-lg">Kod Osobisty</CardTitle>
            <CardDescription>
              Wygeneruj unikalny kod osobisty do breloka na podstawie PESEL
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/kod-osobisty">
              <Button variant="outline" className="w-full">
                Wygeneruj kod
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-purple-600" aria-hidden="true" />
            </div>
            <CardTitle className="text-lg">Dane Otwarte</CardTitle>
            <CardDescription>
              Przeglądaj i eksportuj dane o znalezionych przedmiotach w formacie CSV
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/dane">
              <Button variant="outline" className="w-full">
                Zobacz dane
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <Info className="w-6 h-6 text-amber-600" aria-hidden="true" />
            </div>
            <CardTitle className="text-lg">Informacje</CardTitle>
            <CardDescription>
              Dowiedz się więcej o systemie i jak z niego korzystać
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/informacje">
              <Button variant="outline" className="w-full">
                Czytaj więcej
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* How it works */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Jak działa system?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-blue-800 mb-2">Dla obywateli:</h3>
              <ol className="text-sm text-blue-900 space-y-2">
                <li>1. Wygeneruj kod osobisty z numeru PESEL</li>
                <li>2. Zamów brelok z kodem i przyczep do rzeczy wartościowych</li>
                <li>3. Jeśli zgubisz przedmiot - sprawdź dane otwarte</li>
                <li>4. Odbierz znaleziony przedmiot u urzędnika z dowodem osobistym</li>
              </ol>
            </div>
            <div>
              <h3 className="text-blue-800 mb-2">Dla urzędników:</h3>
              <ol className="text-sm text-blue-900 space-y-2">
                <li>1. Zaloguj się do systemu</li>
                <li>2. Dodaj znaleziony przedmiot do bazy</li>
                <li>3. Weryfikuj właścicieli przez kod osobisty lub opis</li>
                <li>4. Wydawaj przedmioty po potwierdzeniu tożsamości</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="mt-16">
        <h2 className="text-center text-blue-700 mb-8">Kluczowe funkcje systemu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" aria-hidden="true" />
            </div>
            <h3 className="text-gray-700 mb-2">Bezpieczeństwo</h3>
            <p className="text-sm text-gray-600">
              Szyfrowanie SHA-256 kodów osobistych, bezpieczne logowanie urzędników
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-8 h-8 text-green-600" aria-hidden="true" />
            </div>
            <h3 className="text-gray-700 mb-2">Łatwe wyszukiwanie</h3>
            <p className="text-sm text-gray-600">
              Znajdź zgubiony przedmiot po opisie lub kodzie osobistym
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-purple-600" aria-hidden="true" />
            </div>
            <h3 className="text-gray-700 mb-2">Otwarte dane</h3>
            <p className="text-sm text-gray-600">
              Eksport danych w formacie CSV zgodnie z zasadami otwartych danych
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};