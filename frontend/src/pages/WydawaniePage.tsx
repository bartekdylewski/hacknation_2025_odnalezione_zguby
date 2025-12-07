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
import { PackageCheck, Lock, Scan, CheckCircle, XCircle, Search } from 'lucide-react';
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
}

export const WydawaniePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [pesel, setPesel] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    personalCode: string;
    matchingItems: FoundItem[];
  } | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

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

  const handleVerification = async () => {
    setVerificationResult(null);
    setSearchPerformed(false);

    if (!validatePesel(pesel)) {
      setVerificationResult({
        success: false,
        personalCode: '',
        matchingItems: [],
      });
      setSearchPerformed(true);
      return;
    }

    const hash = CryptoJS.SHA256(pesel).toString();
    const personalCode = hash.substring(0, 8).toUpperCase();

    try {
      const allItems = await api.getActiveItems();
      const matchingItems = allItems
        .map((item: any) => ({
          id: item.id,
          category: item.category,
          description: item.description,
          location: item.location,
          date: item.date,
          personalCode: item.personal_code,
          submittedBy: item.submitted_by,
          submittedAt: item.submitted_at,
        }))
        .filter((item: FoundItem) => item.personalCode.toUpperCase() === personalCode);

      setVerificationResult({
        success: true,
        personalCode,
        matchingItems,
      });
    } catch (error) {
      console.error('Error fetching items:', error);
      alert('Błąd podczas pobierania danych');
    }
    setSearchPerformed(true);
  };

  const handleIssueItem = async (itemId: string) => {
    try {
      await api.issueItem(itemId, new Date().toISOString());
      
      if (verificationResult) {
        const updatedMatching = verificationResult.matchingItems.filter((item) => item.id !== itemId);
        setVerificationResult({
          ...verificationResult,
          matchingItems: updatedMatching,
        });
      }
    } catch (error) {
      console.error('Error issuing item:', error);
      alert('Błąd podczas wydawania przedmiotu');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-blue-600" aria-hidden="true" />
            Weryfikacja i Wydawanie Znalezionych Rzeczy
          </CardTitle>
          <CardDescription>
            Zeskanuj dowód osobisty osoby odbierającej lub wprowadź numer PESEL ręcznie
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert role="status">
            <Scan className="w-4 h-4" aria-hidden="true" />
            <AlertDescription>
              System weryfikuje tożsamość poprzez porównanie kodu osobistego wygenerowanego z numeru PESEL
              z dowodu osobistego z kodem zapisanym przy znalezionym przedmiocie.
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
              aria-describedby="pesel-verify-help"
            />
            <p id="pesel-verify-help" className="text-xs text-gray-500 mt-1">
              W rzeczywistym systemie byłby tutaj skaner kodów OCR do automatycznego odczytu z dowodu
            </p>
          </div>

          <Button onClick={handleVerification} className="w-full" size="lg">
            <Search className="w-4 h-4 mr-2" />
            Weryfikuj i Wyszukaj Przedmioty
          </Button>
        </CardContent>
      </Card>

      {searchPerformed && verificationResult && (
        <>
          {!verificationResult.success ? (
            <Alert variant="destructive" className="mb-6" role="alert">
              <XCircle className="w-4 h-4" aria-hidden="true" />
              <AlertDescription>
                Nieprawidłowy numer PESEL. Sprawdź czy numer ma 11 cyfr i jest poprawny.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <Card className="mb-6 bg-green-50 border-green-200" role="status" aria-live="polite">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" aria-hidden="true" />
                    Weryfikacja zakończona pomyślnie
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-green-800">
                      Wygenerowany kod osobisty:{' '}
                      <span className="tracking-wider text-green-900">
                        {verificationResult.personalCode}
                      </span>
                    </p>
                    <p className="text-sm text-green-800">
                      Znaleziono {verificationResult.matchingItems.length} pasujących przedmiotów
                    </p>
                  </div>
                </CardContent>
              </Card>

              {verificationResult.matchingItems.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    Brak znalezionych przedmiotów przypisanych do tego kodu osobistego.
                    Sprawdź czy kod osobisty został prawidłowo zapisany przy zgłoszeniu.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-gray-700">Znalezione przedmioty do wydania:</h3>
                  {verificationResult.matchingItems.map((item) => (
                    <Card key={item.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{item.category}</CardTitle>
                            <CardDescription>
                              Zgłoszono: {new Date(item.submittedAt).toLocaleString('pl-PL')}
                            </CardDescription>
                          </div>
                          <Badge variant="secondary">
                            Kod: {item.personalCode}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-xs text-gray-500">Opis:</Label>
                          <p className="text-sm">{item.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-gray-500">Miejsce znalezienia:</Label>
                            <p className="text-sm">{item.location}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Data znalezienia:</Label>
                            <p className="text-sm">
                              {new Date(item.date).toLocaleDateString('pl-PL')}
                            </p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Zgłoszone przez:</Label>
                          <p className="text-sm">{item.submittedBy}</p>
                        </div>
                        <div className="pt-2">
                          <Button
                            onClick={() => handleIssueItem(item.id)}
                            className="w-full bg-green-600 hover:bg-green-700"
                            aria-label={`Wydaj przedmiot: ${item.category}`}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                            Wydaj przedmiot
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      <Card className="mt-8 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-base">Instrukcja weryfikacji</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="text-sm text-gray-700 space-y-2">
            <li>1. Poproś osobę odbierającą o okazanie dowodu osobistego</li>
            <li>2. Wprowadź numer PESEL z dowodu do systemu (lub zeskanuj dokument)</li>
            <li>3. System automatycznie wygeneruje kod osobisty i wyszuka pasujące przedmioty</li>
            <li>4. Sprawdź czy przedmiot odpowiada opisowi i czy osoba potwierdza własność</li>
            <li>5. Jeśli wszystko się zgadza, kliknij &quot;Wydaj przedmiot&quot;</li>
            <li>6. System automatycznie usunie przedmiot z bazy wydanych rzeczy</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};