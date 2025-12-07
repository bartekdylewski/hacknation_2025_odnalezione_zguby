const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'database.db'));

// Przykładowe dane - 30 zgubiony przedmiotów
const sampleItems = [
  {
    id: 'ITEM-' + Date.now() + '-1',
    category: 'Portfel',
    description: 'Czarny skórzany portfel',
    detailed_description: 'Portfel męski, skóra naturalna, wymiary około 12x9 cm',
    color: 'Czarny',
    special_marks: 'Logo Tommy Hilfiger, lekkie przetarcia na rogach',
    contents: 'Dokumenty, karty bankowe',
    location: 'Park Centralny, ławka przy fontannie',
    date: '2025-12-05',
    personal_code: 'AB123456',
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-2',
    category: 'Telefon',
    description: 'Smartfon Samsung Galaxy',
    detailed_description: 'Samsung Galaxy S21, stan używany',
    color: 'Srebrny',
    special_marks: 'Pęknięcie w lewym górnym rogu ekranu, etui w kolorze niebieskim',
    contents: null,
    location: 'Dworzec PKP, poczekania',
    date: '2025-12-06',
    personal_code: null, // Brak kodu - uszkodzony brelok
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-3',
    category: 'Klucze',
    description: 'Pęk kluczy z brelokiem',
    detailed_description: '5 kluczy na pierścieniu',
    color: 'Srebrne klucze',
    special_marks: 'Brelok z logo BMW, czerwony smycz',
    contents: null,
    location: 'Parking przy centrum handlowym Galeria',
    date: '2025-12-04',
    personal_code: 'CD789012',
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-4',
    category: 'Plecak',
    description: 'Plecak szkolny Nike',
    detailed_description: 'Sportowy plecak Nike, pojemność około 25L',
    color: 'Czarno-czerwony',
    special_marks: 'Logo Nike z przodu, napis "JUST DO IT" na plecach',
    contents: 'Zeszyty, podręczniki szkolne, piórnik',
    location: 'Przystanek autobusowy przy ul. Kościuszki',
    date: '2025-12-03',
    personal_code: null,
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-5',
    category: 'Okulary',
    description: 'Okulary przeciwsłoneczne',
    detailed_description: 'Okulary damskie w eleganckim stylu',
    color: 'Oprawki czarne z brązowymi szkłami',
    special_marks: 'Logo Ray-Ban na zausznikach',
    contents: null,
    location: 'Kawiarnia Cafe Central, stolik przy oknie',
    date: '2025-12-07',
    personal_code: 'EF345678',
    submitted_by: 'system',
    submitted_at: new Date().toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-6',
    category: 'Parasol',
    description: 'Parasol składany',
    detailed_description: 'Parasol automatyczny, składany',
    color: 'Granatowy w białe kropki',
    special_marks: null,
    contents: null,
    location: 'Autobus linii 15, siedzenie z tyłu',
    date: '2025-12-02',
    personal_code: null,
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-7',
    category: 'Zegarek',
    description: 'Zegarek męski',
    detailed_description: 'Zegarek na rękę, mechanizm kwarcowy',
    color: 'Koperta srebrna, pasek czarny skórzany',
    special_marks: 'Napis "Citizen" na tarczy, lekkie zadrapania na kopercie',
    contents: null,
    location: 'Siłownia FitLife, szatnia męska',
    date: '2025-12-01',
    personal_code: 'GH901234',
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-8',
    category: 'Laptop',
    description: 'Laptop Dell w torbie',
    detailed_description: 'Dell Latitude 15 cali w czarnej torbie na laptopa',
    color: 'Laptop czarny, torba czarna',
    special_marks: 'Naklejka "HackNation 2024" na wieku laptopa',
    contents: 'Ładowarka, mysz bezprzewodowa',
    location: 'Biblioteka Miejska, sala czytelni',
    date: '2025-11-30',
    personal_code: null,
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-9',
    category: 'Szalik',
    description: 'Szalik wełniany',
    detailed_description: 'Długi szalik zimowy, wełna',
    color: 'Czerwony w białe paski',
    special_marks: 'Frędzelki na końcach',
    contents: null,
    location: 'Kino Multikino, sala nr 5',
    date: '2025-11-29',
    personal_code: 'IJ567890',
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-10',
    category: 'Torba sportowa',
    description: 'Torba sportowa Adidas',
    detailed_description: 'Duża torba sportowa z kieszeniami',
    color: 'Czarna z białymi paskami',
    special_marks: 'Logo Adidas (trzy paski), mały napis odręczny "Ania" w środku',
    contents: 'Ubrania sportowe, buty do biegania, bidon',
    location: 'Basen miejski, szatnia damska',
    date: '2025-11-28',
    personal_code: null,
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-11',
    category: 'Książka',
    description: 'Książka "Wiedźmin"',
    detailed_description: 'Andrzej Sapkowski - Ostatnie Życzenie',
    color: 'Okładka zielona z ilustracją',
    special_marks: 'Dedykacja na pierwszej stronie: "Dla Tomka, Boże Narodzenie 2023"',
    contents: null,
    location: 'Tramwaj linii 7, przedział środkowy',
    date: '2025-11-27',
    personal_code: 'KL123890',
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-12',
    category: 'Słuchawki',
    description: 'Słuchawki bezprzewodowe',
    detailed_description: 'AirPods Pro w etui ładującym',
    color: 'Białe',
    special_marks: 'Etui z naklejką emoji (uśmiechnięta buźka)',
    contents: null,
    location: 'McDonald\'s, przy kasie',
    date: '2025-11-26',
    personal_code: null,
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-13',
    category: 'Rękawiczki',
    description: 'Para rękawiczek zimowych',
    detailed_description: 'Rękawiczki dzianinowe z futerkiem w środku',
    color: 'Szare',
    special_marks: 'Haftowany wzór płatków śniegu',
    contents: null,
    location: 'Sklep Biedronka, kasa nr 3',
    date: '2025-11-25',
    personal_code: 'MN456789',
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-14',
    category: 'Tablet',
    description: 'Tablet iPad',
    detailed_description: 'Apple iPad 10.2 cala',
    color: 'Srebrny',
    special_marks: 'Etui typu Smart Cover w kolorze czerwonym, rysa na tylnej obudowie',
    contents: null,
    location: 'Restauracja La Vita, stolik nr 12',
    date: '2025-11-24',
    personal_code: null,
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-15',
    category: 'Torebka damska',
    description: 'Torebka skórzana',
    detailed_description: 'Średniej wielkości torebka listonoszka',
    color: 'Brązowa',
    special_marks: 'Logo Michael Kors, zamek z logo MK',
    contents: 'Kosmetyczka, portmonetka',
    location: 'Salon fryzjerski Magiczne Nożyczki',
    date: '2025-11-23',
    personal_code: 'OP789012',
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-16',
    category: 'Aparat fotograficzny',
    description: 'Aparat Canon',
    detailed_description: 'Canon EOS 2000D z obiektywem kit',
    color: 'Czarny',
    special_marks: 'Pasek na szyję w kolorze niebieskim z żółtym',
    contents: 'Karta pamięci, obiektyw dodatkowy w pokrowcu',
    location: 'Park Rozrywki, przy karuzeli',
    date: '2025-11-22',
    personal_code: null,
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-17',
    category: 'Biżuteria',
    description: 'Złoty łańcuszek',
    detailed_description: 'Łańcuszek damski, próba 585',
    color: 'Złoty',
    special_marks: 'Wisiorek w kształcie serca z grawerem "A+M"',
    contents: null,
    location: 'Centrum medyczne, poczekalnia',
    date: '2025-11-21',
    personal_code: 'QR234567',
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-18',
    category: 'Walizka',
    description: 'Walizka podróżna',
    detailed_description: 'Średnia walizka na kółkach',
    color: 'Niebieska',
    special_marks: 'Naklejki z różnych krajów (Włochy, Francja, Hiszpania)',
    contents: 'Ubrania, kosmetyki, dokumenty podróżne',
    location: 'Dworzec autobusowy, peron 5',
    date: '2025-11-20',
    personal_code: null,
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-19',
    category: 'Kurtka',
    description: 'Kurtka zimowa męska',
    detailed_description: 'Kurtka puchowa The North Face',
    color: 'Czarna z pomarańczowymi elementami',
    special_marks: 'Logo The North Face na piersi, rozmiar L',
    contents: 'Rękawiczki w kieszeni',
    location: 'Góra Narciarska Zieleniec, wypożyczalnia sprzętu',
    date: '2025-11-19',
    personal_code: 'ST890123',
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-20',
    category: 'Gitara',
    description: 'Gitara akustyczna',
    detailed_description: 'Yamaha F310, gitara klasyczna',
    color: 'Naturalne drewno',
    special_marks: 'Naklejka zespołu "Metallica" na korpusie, brak jednej struny',
    contents: 'Pokrowiec miękki, kilka kostek do gry',
    location: 'Dom Kultury, sala koncertowa',
    date: '2025-11-18',
    personal_code: null,
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-21',
    category: 'Dokumenty',
    description: 'Teczka z dokumentami',
    detailed_description: 'Czarna teczka skórzana z dokumentami firmowymi',
    color: 'Czarna',
    special_marks: 'Złote inicjały "J.K." wytłoczone na górze',
    contents: 'Dokumenty firmowe, wizytówki, notes',
    location: 'Hotel Marriott, lobby',
    date: '2025-11-17',
    personal_code: 'UV456789',
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-22',
    category: 'Buty',
    description: 'Para butów sportowych',
    detailed_description: 'Nike Air Max, rozmiar 42',
    color: 'Białe z czarnymi dodatkami',
    special_marks: 'Logo Nike (swoosh), lekko zabrudzone',
    contents: null,
    location: 'Stadion miejski, trybuna B',
    date: '2025-11-16',
    personal_code: null,
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-23',
    category: 'Powerbank',
    description: 'Powerbank czarny',
    detailed_description: 'Przenośna ładowarka 20000mAh',
    color: 'Czarny',
    special_marks: 'Logo Xiaomi, mała wgniecenie z boku',
    contents: 'Kabel USB-C w zestawie',
    location: 'Pociąg Intercity relacji Warszawa-Kraków, wagon 7',
    date: '2025-11-15',
    personal_code: 'WX012345',
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-24',
    category: 'Czapka',
    description: 'Czapka zimowa z pomponem',
    detailed_description: 'Czapka dzianinowa z dużym pomponem',
    color: 'Różowa',
    special_marks: 'Haftowany napis "Winter 2024"',
    contents: null,
    location: 'Lodowisko miejskie, przy wejściu',
    date: '2025-11-14',
    personal_code: null,
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-25',
    category: 'E-book reader',
    description: 'Czytnik Kindle',
    detailed_description: 'Amazon Kindle Paperwhite',
    color: 'Czarny',
    special_marks: 'Etui skórzane w kolorze bordowym',
    contents: null,
    location: 'Kawiarnia Starbucks, stolik przy oknie',
    date: '2025-11-13',
    personal_code: 'YZ678901',
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-26',
    category: 'Zabawka',
    description: 'Pluszowy miś',
    detailed_description: 'Duży pluszowy miś około 50 cm',
    color: 'Brązowy',
    special_marks: 'Czerwona kokardka na szyi, przywieszka z napisem "Kocham Cię"',
    contents: null,
    location: 'Park miejski, plac zabaw dla dzieci',
    date: '2025-11-12',
    personal_code: null,
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-27',
    category: 'Smartwatch',
    description: 'Smartwatch Apple Watch',
    detailed_description: 'Apple Watch Series 7, 44mm',
    color: 'Koperta czarna, pasek niebieski silikonowy',
    special_marks: 'Lekkie zadrapania na ekranie',
    contents: null,
    location: 'Siłownia City Fitness, przy bieżniach',
    date: '2025-11-11',
    personal_code: 'AA234567',
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-28',
    category: 'Kask rowerowy',
    description: 'Kask rowerowy',
    detailed_description: 'Kask rowerowy typu miejskiego',
    color: 'Żółty',
    special_marks: 'Logo marki "Uvex", paski zapięcia szare',
    contents: null,
    location: 'Ścieżka rowerowa przy rzece, ławka nr 15',
    date: '2025-11-10',
    personal_code: null,
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-29',
    category: 'Torba na zakupy',
    description: 'Torba wielorazowa',
    detailed_description: 'Duża torba materiałowa na zakupy',
    color: 'Beżowa z zielonym logo',
    special_marks: 'Napis "ECO friendly", logo sklepu bio',
    contents: 'Kilka produktów spożywczych',
    location: 'Parking przed centrum handlowym',
    date: '2025-11-09',
    personal_code: 'BB890123',
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'ITEM-' + Date.now() + '-30',
    category: 'Długopis',
    description: 'Luksusowy długopis',
    detailed_description: 'Parker Jotter, długopis z grawerem',
    color: 'Srebrny z czarnym wykończeniem',
    special_marks: 'Grawerunek: "Za 10 lat pracy - firma XYZ"',
    contents: null,
    location: 'Urząd Miasta, sala konferencyjna',
    date: '2025-11-08',
    personal_code: 'CC456789',
    submitted_by: 'system',
    submitted_at: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  }
];

console.log('🌱 Rozpoczynam dodawanie przykładowych danych do bazy...\n');

// Dodaj przedmioty do bazy
const insertStmt = db.prepare(`
  INSERT INTO found_items (
    id, category, description, detailed_description, color, special_marks,
    contents, location, date, personal_code, submitted_by, submitted_at, status
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const confirmStmt = db.prepare(`
  INSERT INTO item_confirmations (item_id, confirmed_by)
  VALUES (?, ?)
`);

let added = 0;
let withCode = 0;
let withoutCode = 0;

for (const item of sampleItems) {
  try {
    insertStmt.run(
      item.id,
      item.category,
      item.description,
      item.detailed_description,
      item.color,
      item.special_marks,
      item.contents,
      item.location,
      item.date,
      item.personal_code,
      item.submitted_by,
      item.submitted_at,
      item.status
    );
    
    confirmStmt.run(item.id, item.submitted_by);
    
    added++;
    if (item.personal_code) {
      withCode++;
    } else {
      withoutCode++;
    }
    
    console.log(`✓ Dodano: ${item.category} - ${item.description.substring(0, 40)}...`);
  } catch (error) {
    console.error(`✗ Błąd przy dodawaniu ${item.category}:`, error.message);
  }
}

console.log('\n📊 Podsumowanie:');
console.log(`   Dodano przedmiotów: ${added}`);
console.log(`   Z kodem osobistym: ${withCode}`);
console.log(`   Bez kodu osobistego: ${withoutCode}`);
console.log('\n✅ Dane przykładowe zostały dodane do bazy!');

db.close();
