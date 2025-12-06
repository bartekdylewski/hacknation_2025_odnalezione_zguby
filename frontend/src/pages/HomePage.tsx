import { Link } from 'react-router-dom';
import { Search, FileText, Shield, PackageCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export const HomePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-blue-700 mb-4">Witamy w systemie Znalezionych Rzeczy</h2>
        <p className="text-gray-600">
          Platforma umożliwiająca zgłaszanie i odbiór zagubionych przedmiotów z poszanowaniem prywatności obywateli.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/dane" aria-label="Przejdź do strony z danymi otwartymi">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full focus-within:ring-2 focus-within:ring-blue-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" aria-hidden="true" />
                Dane Otwarte
              </CardTitle>
              <CardDescription>
                Przeglądaj wszystkie znalezione przedmioty
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Dostęp do pełnej bazy danych znalezionych rzeczy. Możliwość eksportu do CSV.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/formularz" aria-label="Przejdź do formularza zgłoszenia">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full focus-within:ring-2 focus-within:ring-blue-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Formularz Zgłoszenia
              </CardTitle>
              <CardDescription>
                Zgłoś znaleziony przedmiot do systemu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Dostępne tylko dla upoważnionych osób. Wymaga zalogowania.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/kod-osobisty">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full focus-within:ring-2 focus-within:ring-blue-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Generator Kodu Osobistego
              </CardTitle>
              <CardDescription>
                Wygeneruj kod osobisty na podstawie PESEL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Bezpieczne szyfrowanie numeru PESEL metodą SHA-256.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/informacje">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full focus-within:ring-2 focus-within:ring-blue-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                Informacje
              </CardTitle>
              <CardDescription>
                Jak zgłosić znalezioną rzecz?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Dowiedz się, gdzie i jak zgłosić znalezienie czyjegoś zagubionego przedmiotu.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/wydawanie">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full focus-within:ring-2 focus-within:ring-blue-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-blue-600" />
                Wydawanie Rzeczy
              </CardTitle>
              <CardDescription>
                Weryfikacja i wydawanie znalezionych przedmiotów
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Dostępne tylko dla upoważnionych osób. Wymaga zalogowania.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};