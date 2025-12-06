import { useState } from 'react';
import CryptoJS from 'crypto-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Shield, Info } from 'lucide-react';

export const KodOsobistyPage = () => {
  const [pesel, setPesel] = useState('');
  const [personalCode, setPersonalCode] = useState('');
  const [error, setError] = useState('');

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

  const generatePersonalCode = () => {
    setError('');
    setPersonalCode('');

    if (!validatePesel(pesel)) {
      setError('Nieprawidłowy numer PESEL. Sprawdź czy numer ma 11 cyfr i jest poprawny.');
      return;
    }

    const hash = CryptoJS.SHA256(pesel).toString();
    const code = hash.substring(0, 8).toUpperCase();
    setPersonalCode(code);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" aria-hidden="true" />
            Generator Kodu Osobistego
          </CardTitle>
          <CardDescription>
            Wygeneruj bezpieczny kod osobisty na podstawie numeru PESEL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert role="status">
            <Info className="w-4 h-4" aria-hidden="true" />
            <AlertDescription>
              Kod osobisty to pierwsze 8 znaków zaszyfrowanego numeru PESEL przy użyciu algorytmu SHA-256.
              Służy do bezpiecznej identyfikacji właściciela bez ujawniania pełnego numeru PESEL.
            </AlertDescription>
          </Alert>

          <div>
            <Label htmlFor="pesel">Numer PESEL</Label>
            <Input
              id="pesel"
              type="text"
              placeholder="Wprowadź 11-cyfrowy numer PESEL"
              value={pesel}
              onChange={(e) => setPesel(e.target.value.replace(/\D/g, '').slice(0, 11))}
              maxLength={11}
              aria-required="true"
              aria-describedby="pesel-help"
            />
            <p id="pesel-help" className="text-xs text-gray-500 mt-1">
              Numer PESEL musi składać się z 11 cyfr
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button onClick={generatePersonalCode} className="w-full" aria-label="Wygeneruj kod osobisty z numeru PESEL">
            Generuj Kod Osobisty
          </Button>

          {personalCode && (
            <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200" role="region" aria-live="polite">
              <Label className="text-blue-900">Wygenerowany Kod Osobisty:</Label>
              <div className="mt-2 text-2xl tracking-wider text-blue-700 break-all">
                {personalCode}
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Zapisz ten kod - będzie potrzebny do weryfikacji podczas odbioru rzeczy
              </p>
            </div>
          )}

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm text-gray-700 mb-2">Informacje o bezpieczeństwie:</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Kod osobisty nie umożliwia odtworzenia numeru PESEL</li>
              <li>• Szyfrowanie SHA-256 jest jednokierunkowe i bezpieczne</li>
              <li>• Ten sam PESEL zawsze wygeneruje ten sam kod osobisty</li>
              <li>• Kod służy wyłącznie do weryfikacji tożsamości przy odbiorze rzeczy</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};