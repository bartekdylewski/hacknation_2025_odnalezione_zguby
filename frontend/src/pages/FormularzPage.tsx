import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Alert, AlertDescription } from '../components/ui/alert';
import { FileText, Lock } from 'lucide-react';

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

export const FormularzPage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    location: '',
    date: '',
    personalCode: '',
  });
  const [success, setSuccess] = useState(false);

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
              Dostęp do formularza zgłoszenia jest ograniczony tylko dla upoważnionych osób
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">
              Aby zgłosić znaleziony przedmiot, musisz się najpierw zalogować do systemu.
            </p>
            <Button onClick={() => navigate('/login')} aria-label="Przejdź do strony logowania">
              Przejdź do logowania
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: FoundItem = {
      id: Date.now().toString(),
      ...formData,
      submittedBy: currentUser?.username || '',
      submittedAt: new Date().toISOString(),
    };

    const items = JSON.parse(localStorage.getItem('foundItems') || '[]');
    items.push(newItem);
    localStorage.setItem('foundItems', JSON.stringify(items));

    setSuccess(true);
    setFormData({
      category: '',
      description: '',
      location: '',
      date: '',
      personalCode: '',
    });

    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" aria-hidden="true" />
            Formularz Zgłoszenia Znalezionej Rzeczy
          </CardTitle>
          <CardDescription>
            Wypełnij poniższy formularz, aby zgłosić znaleziony przedmiot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="category">Kategoria przedmiotu</Label>
              <Input
                id="category"
                type="text"
                placeholder="np. Portfel, Telefon, Klucze"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                aria-required="true"
              />
            </div>

            <div>
              <Label htmlFor="description">Szczegółowy opis</Label>
              <Textarea
                id="description"
                placeholder="Opisz znaleziony przedmiot (kolor, marka, charakterystyczne cechy)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
                aria-required="true"
              />
            </div>

            <div>
              <Label htmlFor="location">Miejsce znalezienia</Label>
              <Input
                id="location"
                type="text"
                placeholder="np. Park Centralny, ul. Główna 15"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                aria-required="true"
              />
            </div>

            <div>
              <Label htmlFor="date">Data znalezienia</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                aria-required="true"
              />
            </div>

            <div>
              <Label htmlFor="personalCode">Kod osobisty (jeśli znany)</Label>
              <Input
                id="personalCode"
                type="text"
                placeholder="8-znakowy kod osobisty właściciela"
                value={formData.personalCode}
                onChange={(e) => setFormData({ ...formData, personalCode: e.target.value.slice(0, 8) })}
                maxLength={8}
              />
              <p className="text-xs text-gray-500 mt-1">
                Jeśli znaleziony przedmiot zawiera informacje umożliwiające wygenerowanie kodu osobistego
              </p>
            </div>

            {success && (
              <Alert>
                <AlertDescription>
                  Zgłoszenie zostało pomyślnie zapisane w systemie!
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" aria-label="Wyślij zgłoszenie znalezionego przedmiotu">
              Zgłoś znaleziony przedmiot
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};