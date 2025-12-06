import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Info, MapPin, Phone, Mail, Clock } from 'lucide-react';

export const InformacjePage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-blue-700 mb-2">Informacje o zgłaszaniu znalezionych rzeczy</h2>
        <p className="text-gray-600">
          Dowiedz się, jak prawidłowo zgłosić znalezienie czyjegoś zagubionego przedmiotu
        </p>
      </div>

      <Alert className="mb-6">
        <Info className="w-4 h-4" />
        <AlertDescription>
          Znalezienie cudzej rzeczy nakłada na znalazcę obowiązek jej zwrotu właścicielowi lub zgłoszenia odpowiednim organom.
          Dziękujemy za Twoją uczciwość!
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Krok 1: Oceń wartość znalezionej rzeczy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="mb-2">
                <span className="text-blue-600">Rzeczy o niskiej wartości:</span> portfele, klucze, dokumenty, telefony
              </p>
              <p className="text-sm text-gray-600">
                Należy zgłosić w najbliższym urzędzie gminy, policji lub przekazać zarządcy nieruchomości
              </p>
            </div>
            <div>
              <p className="mb-2">
                <span className="text-blue-600">Rzeczy o wysokiej wartości:</span> biżuteria, sprzęt elektroniczny, gotówka powyżej 500 zł
              </p>
              <p className="text-sm text-gray-600">
                Należy niezwłocznie zgłosić na policji
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Krok 2: Gdzie zgłosić?
            </CardTitle>
            <CardDescription>Wybierz odpowiednią instytucję</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="mb-1">Urząd Gminy / Miasta</h4>
              <p className="text-sm text-gray-600 mb-2">
                Dla rzeczy znalezionych w miejscach publicznych (ulica, park, transport publiczny)
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="w-4 h-4" />
                <span>Poniedziałek - Piątek: 8:00 - 16:00</span>
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="mb-1">Posterunek Policji</h4>
              <p className="text-sm text-gray-600 mb-2">
                Dla rzeczy wartościowych lub dokumentów tożsamości
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Phone className="w-4 h-4" />
                <span>Telefon alarmowy: 112 lub 997</span>
              </div>
            </div>

            <div className="border-l-4 border-amber-500 pl-4">
              <h4 className="mb-1">Zarządca nieruchomości</h4>
              <p className="text-sm text-gray-600">
                Dla rzeczy znalezionych w budynkach (centra handlowe, biurowce, klatki schodowe)
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="mb-1">System online znalezione.gov.pl</h4>
              <p className="text-sm text-gray-600">
                Dla upoważnionych pracowników instytucji przyjmujących zgłoszenia
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Krok 3: Co zabrać ze sobą przy zgłoszeniu?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Znaleziony przedmiot (jeśli to możliwe)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Swój dowód osobisty lub inny dokument tożsamości</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Informacje o miejscu i czasie znalezienia</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Opis przedmiotu i okoliczności znalezienia</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Krok 4: Co się stanie dalej?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700">
              Po przyjęciu zgłoszenia, instytucja wyda Ci potwierdzenie przyjęcia rzeczy znalezionej.
            </p>
            <p className="text-sm text-gray-700">
              Jeśli właściciel nie zgłosi się po odbiór w ciągu określonego czasu (zazwyczaj 6 miesięcy),
              znalazca może nabyć prawo własności do znalezionej rzeczy.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Potrzebujesz pomocy?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-gray-700">
              W razie pytań skontaktuj się z najbliższym urzędem gminy lub posterunkiem policji.
            </p>
            <p className="text-gray-700">
              Infolinia: <span className="text-blue-600">800 123 456</span> (bezpłatna)
            </p>
            <p className="text-gray-700">
              Email: <span className="text-blue-600">kontakt@znalezione.gov.pl</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
