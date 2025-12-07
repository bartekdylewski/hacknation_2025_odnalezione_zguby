import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Alert, AlertDescription } from '../components/ui/alert';
import { PackagePlus, CheckCircle } from 'lucide-react';
import { api } from '../api/client';

export const FormularzPage = () => {
  const [personId, setPersonId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [foundAt, setFoundAt] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await api.addItem({
        person_id: personId.trim().toUpperCase() || '',
        title: title.trim(),
        description: description.trim(),
        found_at: foundAt.trim(),
        status: 'znalezione',
      });

      setSubmitted(true);

      // Reset formularza po 2 sekundach
      setTimeout(() => {
        setSubmitted(false);
        setPersonId('');
        setTitle('');
        setDescription('');
        setFoundAt('');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Wystąpił błąd podczas dodawania przedmiotu.');
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-6 h-6" aria-hidden="true" />
              Przedmiot został dodany do systemu
            </CardTitle>
            <CardDescription className="text-green-700">
              Za chwilę formularz zostanie zresetowany...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-blue-700 mb-2">Dodaj Znaleziony Przedmiot</h2>
        <p className="text-gray-600">
          Wprowadź informacje o znalezionym przedmiocie do systemu
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackagePlus className="w-5 h-5 text-blue-600" aria-hidden="true" />
            Formularz zgłoszenia
          </CardTitle>
          <CardDescription>
            Wszystkie pola oprócz kodu osobistego są wymagane
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Alert>
              <AlertDescription>
                <strong>Kod osobisty (opcjonalny):</strong> Jeśli do przedmiotu dołączony jest brelok z kodem osobistym, wprowadź go poniżej. W przeciwnym razie pozostaw pole puste.
              </AlertDescription>
            </Alert>

            <div>
              <Label htmlFor="person-id">
                Kod osobisty z breloka (opcjonalny)
              </Label>
              <Input
                id="person-id"
                type="text"
                placeholder="np. 2G4JD92J"
                value={personId}
                onChange={(e) => setPersonId(e.target.value.toUpperCase())}
                maxLength={8}
                aria-describedby="person-id-help"
              />
              <p id="person-id-help" className="text-xs text-gray-500 mt-1">
                Pozostaw puste jeśli przedmiot nie ma przypisanego kodu (max 8 znaków)
              </p>
            </div>

            <div>
              <Label htmlFor="title">
                Nazwa przedmiotu *
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="np. Laptop Dell"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                aria-required="true"
              />
            </div>

            <div>
              <Label htmlFor="description">
                Szczegółowy opis *
              </Label>
              <Textarea
                id="description"
                placeholder="np. Srebrny laptop Dell Latitude 5300"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                aria-required="true"
                aria-describedby="description-help"
              />
              <p id="description-help" className="text-xs text-gray-500 mt-1">
                Im więcej szczegółów, tym łatwiej będzie zidentyfikować właściciela
              </p>
            </div>

            <div>
              <Label htmlFor="found-at">
                Miejsce znalezienia *
              </Label>
              <Input
                id="found-at"
                type="text"
                placeholder="np. Starostwo Powiatowe w Bydgoszczy, Polska"
                value={foundAt}
                onChange={(e) => setFoundAt(e.target.value)}
                required
                aria-required="true"
              />
            </div>

            <Alert>
              <AlertDescription>
                Data i godzina dodania przedmiotu zostaną automatycznie zapisane w systemie.
              </AlertDescription>
            </Alert>

            <Button type="submit" className="w-full" size="lg">
              <PackagePlus className="w-4 h-4 mr-2" aria-hidden="true" />
              Dodaj przedmiot do systemu
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-base">Instrukcja dodawania przedmiotów</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-2">
          <p>1. Sprawdź czy do przedmiotu dołączony jest brelok z kodem osobistym</p>
          <p>2. Wprowadź kod (jeśli istnieje) lub pozostaw pole puste</p>
          <p>3. Podaj nazwę i szczegółowy opis znalezionego przedmiotu</p>
          <p>4. Wskaż dokładne miejsce znalezienia</p>
          <p>5. Kliknij &quot;Dodaj przedmiot do systemu&quot;</p>
        </CardContent>
      </Card>
    </div>
  );
};