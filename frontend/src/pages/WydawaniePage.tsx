import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { PackageCheck, Lock, CheckCircle, XCircle, Search, Info } from 'lucide-react';
import { formatDateTime } from '../utils/database';
import type { FoundItem } from '../utils/database';

export const WydawaniePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [pesel, setPesel] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItemId, setExpandedItemId] = useState<number | null>(null);
  const [itemPesel, setItemPesel] = useState<{ [key: number]: string }>({});
  const [verifiedItemIds, setVerifiedItemIds] = useState<Set<number>>(new Set());
  const [selectedItem, setSelectedItem] = useState<FoundItem | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-600" aria-hidden="true" />
              Wymagane logowanie
            </CardTitle>
            <CardDescription>
              Dostęp do systemu wydawania jest ograniczony tylko dla upoważnionych osób
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">
              Aby weryfikować i wydawać znalezione przedmioty, musisz się najpierw zalogować do systemu.
            </p>
            <Button onClick={() => navigate('/login')}>
              Przejdź do logowania
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const validatePesel = (pesel: string): boolean => {
    if (pesel.length !== 11) return false;
    if (!/^\d+$/.test(pesel)) return false;
    
    const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    let sum = 0;
    
    for (let i = 0; i < 10; i++) {
      sum += parseInt(pesel[i]) * weights[i];
    }
    
    const checksum = (10 - (sum % 10)) % 10;
    return checksum === parseInt(pesel[10]);
  };

  const handlePeselVerification = () => {
    if (!validatePesel(pesel)) {
      alert('Nieprawidłowy numer PESEL. Sprawdź czy numer ma 11 cyfr i jest poprawny.');
      return;
    }

    const hash = CryptoJS.SHA256(pesel).toString();
    const personalCode = hash.substring(0, 8).toUpperCase();

    const allItems: FoundItem[] = JSON.parse(localStorage.getItem('foundItems') || '[]');
    const matchingItems = allItems.filter(
      (item) => item.status === 'znalezione' && item.person_id.toUpperCase() === personalCode
    );

    if (matchingItems.length === 0) {
      alert(`Nie znaleziono przedmiotów dla kodu osobistego: ${personalCode}\n\nSprawdź czy osoba ma właściwy brelok lub użyj wyszukiwarki dla przedmiotów bez kodu.`);
      return;
    }

    // Oznacz wszystkie znalezione przedmioty jako zweryfikowane
    const newVerifiedIds = new Set(verifiedItemIds);
    matchingItems.forEach(item => newVerifiedIds.add(item.id));
    setVerifiedItemIds(newVerifiedIds);

    alert(`✅ Weryfikacja PESEL pomyślna!\n\nZnaleziono ${matchingItems.length} przedmiot(ów).\n\nPrzedmioty są teraz oznaczone i gotowe do wydania.`);
    setSearchQuery(personalCode);
    setPesel('');
  };

  const handleItemPeselVerification = (item: FoundItem) => {
    const peselValue = itemPesel[item.id] || '';
    
    if (!validatePesel(peselValue)) {
      alert('Nieprawidłowy numer PESEL. Sprawdź czy numer ma 11 cyfr i jest poprawny.');
      return;
    }

    const hash = CryptoJS.SHA256(peselValue).toString();
    const personalCode = hash.substring(0, 8).toUpperCase();

    if (item.person_id.toUpperCase() !== personalCode) {
      alert(`❌ PESEL nie pasuje do tego przedmiotu!\n\nWygenerowany kod: ${personalCode}\nKod przedmiotu: ${item.person_id}\n\nSprawdź czy osoba pokazała właściwy dokument.`);
      return;
    }

    // Oznacz przedmiot jako zweryfikowany
    const newVerifiedIds = new Set(verifiedItemIds);
    newVerifiedIds.add(item.id);
    setVerifiedItemIds(newVerifiedIds);

    alert(`✅ Weryfikacja PESEL pomyślna!\n\nPrzedmiot "${item.title}" jest teraz zweryfikowany i można go wydać.`);
    
    // Wyczyść PESEL dla tego przedmiotu
    const newItemPesel = { ...itemPesel };
    delete newItemPesel[item.id];
    setItemPesel(newItemPesel);
  };

  const handleIssueItem = (item: FoundItem) => {
    // Zabezpieczenie - przedmioty z kodem tylko jeśli zweryfikowane przez PESEL
    if (item.person_id && item.person_id.trim() && !verifiedItemIds.has(item.id)) {
      alert('⚠️ ZABEZPIECZENIE SYSTEMU\n\nTen przedmiot ma przypisany kod osobisty i nie został zweryfikowany przez PESEL.\n\nKliknij "Weryfikuj PESEL" i wprowadź numer PESEL z dowodu osoby odbierającej.');
      return;
    }

    if (!confirm(`Czy na pewno chcesz wydać przedmiot "${item.title}"?\n\nPotwierdzam, że zweryfikowałem/am osobę odbierającą i jestem przekonany/a, że jest właścicielem tego przedmiotu.`)) {
      return;
    }

    const items: FoundItem[] = JSON.parse(localStorage.getItem('foundItems') || '[]');
    const updatedItems = items.map((i) =>
      i.id === item.id
        ? { ...i, status: 'wydane' as const, date_modified: formatDateTime() }
        : i
    );
    localStorage.setItem('foundItems', JSON.stringify(updatedItems));
    
    alert('Przedmiot został wydany i oznaczony jako "wydane" w bazie danych.');
    
    // Usuń z listy zweryfikowanych
    const newVerifiedIds = new Set(verifiedItemIds);
    newVerifiedIds.delete(item.id);
    setVerifiedItemIds(newVerifiedIds);
    
    // Zamknij rozwinięty wiersz
    setExpandedItemId(null);
    
    setPesel('');
    setSearchQuery('');
  };

  // Filtrowanie przedmiotów - WSZYSTKIE przedmioty ze statusem "znalezione"
  const allItems: FoundItem[] = JSON.parse(localStorage.getItem('foundItems') || '[]').filter(
    (item: FoundItem) => item.status === 'znalezione'
  );

  const filteredItems = searchQuery.trim()
    ? allItems.filter((item) => {
        const query = searchQuery.toLowerCase();
        return (
          item.id.toString().includes(query) ||
          item.person_id.toLowerCase().includes(query) ||
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.found_at.toLowerCase().includes(query)
        );
      })
    : allItems;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-blue-700 mb-2">Wydawanie Znalezionych Rzeczy</h2>
        <p className="text-gray-600">
          Weryfikacja właścicieli i wydawanie przedmiotów
        </p>
      </div>

      {/* Weryfikacja PESEL */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-blue-600" aria-hidden="true" />
            Weryfikacja przez PESEL
          </CardTitle>
          <CardDescription>
            Wprowadź numer PESEL z dowodu osobistego osoby odbierającej
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="w-4 h-4" aria-hidden="true" />
            <AlertDescription>
              System automatycznie wygeneruje kod osobisty z numeru PESEL i wyszuka przedmioty w bazie danych.
            </AlertDescription>
          </Alert>

          <div>
            <Label htmlFor="pesel-verify">Numer PESEL z dowodu osobistego</Label>
            <Input
              id="pesel-verify"
              type="text"
              placeholder="Wprowadź 11-cyfrowy numer PESEL"
              value={pesel}
              onChange={(e) => setPesel(e.target.value.replace(/\D/g, '').slice(0, 11))}
              maxLength={11}
              aria-required="true"
            />
          </div>

          <Button onClick={handlePeselVerification} className="w-full" size="lg">
            <Search className="w-4 h-4 mr-2" aria-hidden="true" />
            Weryfikuj i Wyszukaj
          </Button>
        </CardContent>
      </Card>

      {/* Wyszukiwarka przedmiotów */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-purple-600" aria-hidden="true" />
            Wyszukiwarka wszystkich przedmiotów
          </CardTitle>
          <CardDescription>
            Przedmioty z kodem można wydać tylko po weryfikacji PESEL
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <Info className="w-4 h-4" aria-hidden="true" />
            <AlertDescription>
              <strong>Zabezpieczenie:</strong> Przedmioty z kodem osobistym można wydać TYLKO po pomyślnej weryfikacji PESEL.
              Przedmioty bez kodu można wydać bezpośrednio po weryfikacji opisowej.
            </AlertDescription>
          </Alert>
          <div>
            <Label htmlFor="search-query">Szukaj w bazie</Label>
            <Input
              id="search-query"
              type="text"
              placeholder="Wpisz cokolwiek aby wyszukać..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Wyświetlono {filteredItems.length} z {allItems.length} przedmiotów ze statusem &quot;znalezione&quot;
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabela wszystkich przedmiotów */}
      <Card>
        <CardHeader>
          <CardTitle>Lista wszystkich przedmiotów</CardTitle>
          <CardDescription>
            Przedmioty z kodem wymagają weryfikacji PESEL przed wydaniem
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredItems.length === 0 ? (
            <Alert>
              <AlertDescription>
                {searchQuery 
                  ? 'Brak przedmiotów pasujących do wyszukiwania.' 
                  : 'Brak dostępnych przedmiotów w systemie.'}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-lg transition-all ${
                    expandedItemId === item.id ? 'border-blue-500 shadow-lg' : ''
                  }`}
                >
                  <div className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge variant="outline">ID: {item.id}</Badge>
                          {item.person_id ? (
                            <>
                              <Badge variant="secondary">Kod: {item.person_id}</Badge>
                              {verifiedItemIds.has(item.id) ? (
                                <Badge className="bg-green-600">✅ Zweryfikowany PESEL</Badge>
                              ) : (
                                <Badge variant="destructive">⚠️ Wymaga weryfikacji PESEL</Badge>
                              )}
                            </>
                          ) : (
                            <Badge variant="secondary">Bez kodu - weryfikacja opisowa</Badge>
                          )}
                        </div>
                        <div>
                          <p className="text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          <p>Miejsce: {item.found_at}</p>
                          <p>Dodano: {item.date_added}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => {
                            if (expandedItemId === item.id) {
                              setExpandedItemId(null);
                            } else {
                              setExpandedItemId(item.id);
                            }
                          }}
                          size="sm"
                          variant="outline"
                          className="whitespace-nowrap"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                          {expandedItemId === item.id ? 'Zwiń' : 'Wydaj'}
                        </Button>
                        {item.person_id && !verifiedItemIds.has(item.id) && expandedItemId !== item.id && (
                          <Alert className="p-2 border-amber-300 bg-amber-50">
                            <AlertDescription className="text-xs text-amber-800">
                              <strong>Zweryfikuj PESEL</strong>
                            </AlertDescription>
                          </Alert>
                        )}
                        {!item.person_id && expandedItemId !== item.id && (
                          <Alert className="p-2">
                            <AlertDescription className="text-xs">
                              <strong>Weryfikacja opisowa</strong>
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rozwinięta sekcja weryfikacji i wydania */}
                  {expandedItemId === item.id && (
                    <div className="border-t bg-blue-50 p-4 space-y-4">
                      {/* Jeśli przedmiot ma kod i nie jest zweryfikowany */}
                      {item.person_id && !verifiedItemIds.has(item.id) && (
                        <div className="bg-white p-4 rounded-lg border-2 border-amber-400 space-y-4">
                          <Alert variant="destructive">
                            <XCircle className="w-4 h-4" aria-hidden="true" />
                            <AlertDescription>
                              <strong>Wymagana weryfikacja PESEL</strong><br />
                              Ten przedmiot ma kod osobisty i wymaga weryfikacji numeru PESEL z dowodu osobistego.
                            </AlertDescription>
                          </Alert>

                          <div>
                            <Label htmlFor={`item-pesel-${item.id}`}>
                              Wprowadź PESEL z dowodu osobistego
                            </Label>
                            <Input
                              id={`item-pesel-${item.id}`}
                              type="text"
                              placeholder="11-cyfrowy numer PESEL"
                              value={itemPesel[item.id] || ''}
                              onChange={(e) => 
                                setItemPesel({
                                  ...itemPesel,
                                  [item.id]: e.target.value.replace(/\D/g, '').slice(0, 11)
                                })
                              }
                              maxLength={11}
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleItemPeselVerification(item)}
                              className="flex-1"
                              disabled={!itemPesel[item.id] || itemPesel[item.id].length !== 11}
                            >
                              <Search className="w-4 h-4 mr-2" aria-hidden="true" />
                              Weryfikuj PESEL
                            </Button>
                            <Button
                              onClick={() => setExpandedItemId(null)}
                              variant="outline"
                            >
                              Anuluj
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Jeśli przedmiot jest zweryfikowany lub nie ma kodu */}
                      {(!item.person_id || verifiedItemIds.has(item.id)) && (
                        <div className="bg-white p-4 rounded-lg border-2 border-green-400 space-y-4">
                          {item.person_id && verifiedItemIds.has(item.id) && (
                            <Alert className="bg-green-50 border-green-200">
                              <CheckCircle className="w-4 h-4 text-green-600" aria-hidden="true" />
                              <AlertDescription className="text-green-800">
                                <strong>✅ Przedmiot zweryfikowany przez PESEL</strong> - można wydać
                              </AlertDescription>
                            </Alert>
                          )}

                          {!item.person_id && (
                            <Alert>
                              <Info className="w-4 h-4" aria-hidden="true" />
                              <AlertDescription>
                                <strong>Weryfikacja opisowa</strong><br />
                                Przedmiot nie ma kodu osobistego. Przeprowadź rozmowę z osobą odbierającą
                                i upewnij się, że potrafi szczegółowo opisać przedmiot.
                              </AlertDescription>
                            </Alert>
                          )}

                          <div className="bg-gray-50 p-3 rounded space-y-2 text-sm">
                            <p><strong>ID:</strong> {item.id}</p>
                            <p><strong>Nazwa:</strong> {item.title}</p>
                            <p><strong>Opis:</strong> {item.description}</p>
                            <p><strong>Miejsce:</strong> {item.found_at}</p>
                            <p><strong>Dodano:</strong> {item.date_added}</p>
                            {item.person_id && (
                              <p><strong>Kod osobisty:</strong> {item.person_id}</p>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleIssueItem(item)}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              size="lg"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                              Potwierdzam - Wydaj przedmiot
                            </Button>
                            <Button
                              onClick={() => setExpandedItemId(null)}
                              variant="outline"
                            >
                              Anuluj
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal wydania pojedynczego przedmiotu */}
      {selectedItem && (
        <Card className="mb-6 border-green-500 border-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-green-700">Przedmiot do wydania</CardTitle>
                <CardDescription>Sprawdź dane i potwierdź wydanie</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedItem(null)}>
                Anuluj
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedItem.person_id && !verifiedItemIds.has(selectedItem.id) && (
              <Alert variant="destructive">
                <XCircle className="w-4 h-4" aria-hidden="true" />
                <AlertDescription>
                  <strong>UWAGA!</strong> Ten przedmiot ma kod osobisty i nie został zweryfikowany przez PESEL.
                  Użyj sekcji &quot;Weryfikacja przez PESEL&quot; powyżej.
                </AlertDescription>
              </Alert>
            )}
            {selectedItem.person_id && verifiedItemIds.has(selectedItem.id) && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="w-4 h-4 text-green-600" aria-hidden="true" />
                <AlertDescription className="text-green-800">
                  <strong>✅ Przedmiot zweryfikowany przez PESEL</strong> - można wydać
                </AlertDescription>
              </Alert>
            )}
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <div>
                <Label className="text-xs text-gray-600">ID:</Label>
                <p>{selectedItem.id}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-600">Kod osobisty:</Label>
                <p className="tracking-wider">
                  {selectedItem.person_id || 'Brak (weryfikacja opisowa)'}
                  {selectedItem.person_id && verifiedItemIds.has(selectedItem.id) && (
                    <Badge className="ml-2 bg-green-600">Zweryfikowany PESEL</Badge>
                  )}
                </p>
              </div>
              <div>
                <Label className="text-xs text-gray-600">Nazwa:</Label>
                <p>{selectedItem.title}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-600">Opis:</Label>
                <p>{selectedItem.description}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-600">Miejsce znalezienia:</Label>
                <p>{selectedItem.found_at}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-600">Data dodania:</Label>
                <p>{selectedItem.date_added}</p>
              </div>
            </div>

            <Button
              onClick={() => handleIssueItem(selectedItem)}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
              disabled={!!selectedItem.person_id && !verifiedItemIds.has(selectedItem.id)}
            >
              <CheckCircle className="w-4 h-4 mr-2" aria-hidden="true" />
              {selectedItem.person_id && !verifiedItemIds.has(selectedItem.id)
                ? 'Wymaga weryfikacji PESEL'
                : 'Wydaj przedmiot'}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-base">Instrukcja wydawania</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-2">
          <p><strong>Weryfikacja przez PESEL (dla przedmiotów Z kodem):</strong></p>
          <p>1. Wprowadź PESEL z dowodu osobistego osoby odbierającej w sekcji powyżej</p>
          <p>2. System automatycznie wygeneruje kod osobisty i zweryfikuje przedmioty</p>
          <p>3. Przedmioty zostaną oznaczone jako &quot;Zweryfikowane PESEL&quot; z zieloną plakietką</p>
          <p>4. Znajdź przedmiot w wyszukiwarce i kliknij &quot;Wydaj&quot;</p>
          <br />
          <p><strong>Weryfikacja opisowa (dla przedmiotów BEZ kodu):</strong></p>
          <p>1. Znajdź przedmiot w wyszukiwarce</p>
          <p>2. Przeprowadź rozmowę z osobą odbierającą</p>
          <p>3. Sprawdź czy osoba potrafi szczegółowo opisać przedmiot</p>
          <p>4. Jeśli jesteś przekonany/a - kliknij &quot;Wydaj&quot;</p>
          <br />
          <p className="text-red-600"><strong>🔒 ZABEZPIECZENIA SYSTEMU:</strong></p>
          <p className="text-red-600">• Przedmioty Z kodem można wydać TYLKO po pomyślnej weryfikacji PESEL</p>
          <p className="text-red-600">• Wyszukiwarka pokazuje wszystkie przedmioty, ale blokuje wydawanie niezweryfikowanych</p>
          <p className="text-red-600">• Po weryfikacji PESEL przedmioty otrzymują zieloną plakietkę &quot;✅ Zweryfikowany PESEL&quot;</p>
          <p className="text-red-600">• Próba wydania przedmiotu z kodem bez weryfikacji zostanie zablokowana</p>
        </CardContent>
      </Card>
    </div>
  );
};