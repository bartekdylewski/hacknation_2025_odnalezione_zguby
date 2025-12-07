import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Download, FileText, Search, Eye, Calendar, MapPin } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { api } from '../api/client';

interface FoundItem {
  id: string;
  category: string;
  description: string;
  location: string;
  date: string;
  personalCode: string;
  submittedBy: string;
  submittedAt: string;
  status?: 'active' | 'issued';
  issuedAt?: string;
}

export const DaneGovPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCsvPreview, setShowCsvPreview] = useState(false);
  const [allItems, setAllItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const items = await api.getItems();
        const mappedItems = items.map((item: any) => ({
          id: item.id,
          category: item.category,
          description: item.description,
          location: item.location,
          date: item.date,
          personalCode: item.personal_code,
          submittedBy: item.submitted_by,
          submittedAt: item.submitted_at,
          status: item.status,
          issuedAt: item.issued_at,
        }));
        setAllItems(mappedItems);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return allItems;
    const term = searchTerm.toLowerCase();
    return allItems.filter(
      (item) =>
        item.category.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term) ||
        item.personalCode.toLowerCase().includes(term)
    );
  }, [allItems, searchTerm]);

  const activeItems = filteredItems.filter((item) => item.status === 'active');
  const issuedItems = filteredItems.filter((item) => item.status === 'issued');

  const generateCSV = (items: FoundItem[]): string => {
    const headers = [
      'ID',
      'Kategoria',
      'Opis',
      'Miejsce znalezienia',
      'Data znalezienia',
      'Kod osobisty',
      'Zgłoszone przez',
      'Data zgłoszenia',
      'Status',
      'Data wydania',
    ];

    const rows = items.map((item) => [
      item.id,
      item.category,
      item.description.replace(/,/g, ';'),
      item.location,
      item.date,
      item.personalCode,
      item.submittedBy,
      new Date(item.submittedAt).toLocaleString('pl-PL'),
      item.status === 'active' ? 'Dostępny' : 'Wydany',
      item.issuedAt ? new Date(item.issuedAt).toLocaleString('pl-PL') : '-',
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  };

  const downloadCSV = () => {
    const csv = generateCSV(filteredItems);
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rzeczy-znalezione-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const csvPreview = generateCSV(filteredItems.slice(0, 10));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-blue-700 mb-2">dane.gov.pl</h1>
        <p className="text-gray-600">
          Centralna baza danych rzeczy znalezionych - transparentność i otwarte dane
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" aria-hidden="true" />
              Statystyki
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl text-blue-700" aria-label={`Łącznie ${allItems.length} przedmiotów`}>
                  {allItems.length}
                </div>
                <div className="text-sm text-gray-600">Łącznie przedmiotów</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl text-green-700" aria-label={`${activeItems.length} dostępnych do odbioru`}>
                  {activeItems.length}
                </div>
                <div className="text-sm text-gray-600">Dostępne do odbioru</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl text-gray-700" aria-label={`${issuedItems.length} wydanych właścicielom`}>
                  {issuedItems.length}
                </div>
                <div className="text-sm text-gray-600">Wydane właścicielom</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="search" className="sr-only">
              Wyszukaj przedmioty
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
              <Input
                id="search"
                type="text"
                placeholder="Wyszukaj przedmioty (kategoria, opis, miejsce, kod osobisty)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                aria-label="Pole wyszukiwania przedmiotów"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCsvPreview(!showCsvPreview)}
              variant="outline"
              aria-label={showCsvPreview ? 'Ukryj podgląd CSV' : 'Pokaż podgląd CSV'}
              aria-pressed={showCsvPreview}
            >
              <Eye className="w-4 h-4 mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Podgląd CSV</span>
              <span className="sm:hidden">CSV</span>
            </Button>
            <Button
              onClick={downloadCSV}
              aria-label="Pobierz dane jako plik CSV"
            >
              <Download className="w-4 h-4 mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Pobierz CSV</span>
              <span className="sm:hidden">Pobierz</span>
            </Button>
          </div>
        </div>

        {showCsvPreview && (
          <Card>
            <CardHeader>
              <CardTitle>Podgląd CSV (pierwsze 10 wyników)</CardTitle>
              <CardDescription>Format danych do pobrania</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-50 p-4 rounded overflow-x-auto text-xs">
                <code>{csvPreview}</code>
              </pre>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2" role="tablist">
          <TabsTrigger value="active" role="tab" aria-selected="true">
            Dostępne ({activeItems.length})
          </TabsTrigger>
          <TabsTrigger value="issued" role="tab">
            Historia wydanych ({issuedItems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" role="tabpanel">
          {activeItems.length === 0 ? (
            <Alert>
              <AlertDescription>
                {searchTerm
                  ? 'Nie znaleziono dostępnych przedmiotów pasujących do wyszukiwania.'
                  : 'Brak dostępnych przedmiotów w systemie.'}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {activeItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="issued" role="tabpanel">
          {issuedItems.length === 0 ? (
            <Alert>
              <AlertDescription>
                {searchTerm
                  ? 'Nie znaleziono wydanych przedmiotów pasujących do wyszukiwania.'
                  : 'Brak wydanych przedmiotów w historii.'}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {issuedItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ItemCard = ({ item }: { item: FoundItem }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{item.category}</CardTitle>
          <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
            {item.status === 'active' ? 'Dostępny' : 'Wydany'}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{item.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <div>
            <div className="text-xs text-gray-500">Miejsce znalezienia:</div>
            <div className="text-gray-700">{item.location}</div>
          </div>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <div>
            <div className="text-xs text-gray-500">Data znalezienia:</div>
            <div className="text-gray-700">{new Date(item.date).toLocaleDateString('pl-PL')}</div>
          </div>
        </div>
        <div className="pt-2 border-t">
          <div className="text-xs text-gray-500">Kod osobisty:</div>
          <div className="tracking-wider text-gray-700">
            {item.personalCode || 'Nie podano'}
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Zgłoszone przez: {item.submittedBy} •{' '}
          {new Date(item.submittedAt).toLocaleDateString('pl-PL')}
        </div>
        {item.issuedAt && (
          <div className="text-xs text-green-600">
            Wydano: {new Date(item.issuedAt).toLocaleDateString('pl-PL')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
