const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'database.db'));

// Generowanie daty w formacie YYYY-MM-DD HH:MM:SS
function generateDate(daysAgo = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const YYYY = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const DD = String(date.getDate()).padStart(2, '0');
  const HH = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`;
}

// Lista 30 przykładowych przedmiotów
const sampleItems = [
  // PRZEDMIOTY Z PERSON_ID (dla przykładu, tylko kilka)
  {
    person_id: "2g4jd92j",
    title: "Laptop Dell",
    description: "Srebrny laptop dell latitude 5300 w czarnej torbie",
    found_at: "Starostwo Powiatowe w Bydgoszczy, sala 205",
    date_added: generateDate(1),
    date_modified: generateDate(1),
    status: "znalezione"
  },
  {
    person_id: "AB123456",
    title: "Portfel skórzany",
    description: "Czarny portfel z dokumentami na nazwisko Jan Kowalski",
    found_at: "Park Centralny, ławka przy fontannie",
    date_added: generateDate(2),
    date_modified: generateDate(2),
    status: "znalezione"
  },
  {
    person_id: "XG998877",
    title: "Smartwatch Garmin",
    description: "Czarny zegarek Garmin Forerunner 945",
    found_at: "Hala sportowa, szatnia męska",
    date_added: generateDate(5),
    date_modified: generateDate(5),
    status: "znalezione"
  },
  {
    person_id: "P00L77AA",
    title: "Klucze do samochodu",
    description: "Kluczyki samochodowe marki BMW na niebieskiej smyczy",
    found_at: "Parking podziemny, sekcja C",
    date_added: generateDate(15),
    date_modified: generateDate(15),
    status: "znalezione"
  },
  
  // PRZEDMIOTY BEZ PERSON_ID (większość)
  {
    person_id: "",
    title: "Telefon Samsung",
    description: "Samsung Galaxy S21, pęknięty ekran w lewym górnym rogu",
    found_at: "Dworzec PKP, poczekalnia",
    date_added: generateDate(1),
    date_modified: generateDate(1),
    status: "znalezione"
  },
  {
    person_id: "",
    title: "Okulary przeciwsłoneczne",
    description: "Okulary Ray-Ban Aviator w czarnym etui",
    found_at: "Autobus linii 53, siedzenie przy oknie",
    date_added: generateDate(3),
    date_modified: generateDate(3),
    status: "znalezione"
  },
  {
    person_id: "",
    title: "Słuchawki bezprzewodowe",
    description: "Białe słuchawki douszne w etui ładującym (Apple AirPods)",
    found_at: "Kawiarnia 'Sweet Coffee', stolik na zewnątrz",
    date_added: generateDate(4),
    date_modified: generateDate(4),
    status: "znalezione"
  },
  {
    person_id: "",
    title: "Plecak turystyczny",
    description: "Duży niebieski plecak, w środku puste butelki",
    found_at: "Szlak turystyczny w lesie miejskim",
    date_added: generateDate(6),
    date_modified: generateDate(6),
    status: "znalezione"
  },
  {
    person_id: "",
    title: "Dowód osobisty",
    description: "Dowód na nazwisko Anna Nowak",
    found_at: "Sklep spożywczy 'Żabka', przy kasie numer 3",
    date_added: generateDate(7),
    date_modified: generateDate(7),
    status: "znalezione"
  },
  {
    person_id: "",
    title: "Parasolka",
    description: "Duża czarna parasolka z drewnianą rączką",
    found_at: "Wejście do kina 'Multikino'",
    date_added: generateDate(8),
    date_modified: generateDate(8),
    status: "znalezione"
  },
  {
    person_id: "",
    title: "Zestaw kluczy",
    description: "Trzy klucze na metalowym kółku z zawieszką 'Miś'",
    found_at: "Pływalnia miejska, basen rekreacyjny",
    date_added: generateDate(9),
    date_modified: generateDate(9),
    status: "znalezione"
  },
  {
    person_id: "",
    title: "Rękawiczki wełniane",
    description: "Ciemnoszare rękawiczki, rozmiar L",
    found_at: "Przystanek tramwajowy 'Rondo Jagiellonów'",
    date_added: generateDate(10),
    date_modified: generateDate(10),
    status: "znalezione"
  },
  {
    person_id: "",
    title: "Książka",
    description: "'Władca Pierścieni: Drużyna Pierścienia', wydanie z 2018",
    found_at: "Biblioteka Główna, czytelnia",
    date_added: generateDate(11),
    date_modified: generateDate(11),
    status: "znalezione"
  },
  {
    person_id: "",
    title: "Karta płatnicza",
    description: "Karta debetowa PKO BP (zablokowana)",
    found_at: "Bankomat przy ulicy Długiej",
    date_added: generateDate(12),
    date_modified: generateDate(12),
    status: "znalezione"
  },
  {
    person_id: "",
    title: "Czapka z daszkiem",
    description: "Biała czapka New Era, logo Yankees",
    found_at: "Skatepark miejski",
    date_added: generateDate(13),
    date_modified: generateDate(13),
    status: "znalezione"
  },
  {
    person_id: "",
    title: "Piórnik",
    description: "Czerwony piórnik z suwakiem, w środku długopisy",
    found_at: "Uniwersytet, Aula C",
    date_added: generateDate(14),
    date_modified: generateDate(14),
    status: "znalezione"
  },
  {
    person_id: "",
    title: "Torba na zakupy",
    description: "Płócienna torba z nadrukiem, w środku jabłka",
    found_at: "Targowisko, stoisko z warzywami",
    date_added: generateDate(16),
    date_modified: generateDate(16),
    status: "znalezione"
  },
  {
    person_id: "",
    title: "Kolczyk",
    description: "Mały złoty kolczyk (wkrętka) z cyrkonią",
    found_at: "Restauracja 'Pod Żaglami', toaleta damska",
    date_added: generateDate(17),
    date_modified: generateDate(17),
    status: "znalezione"
  },
  {
    person_id: "",
    title: "Pendrive",
    description: "8GB USB 3.0, czarny z pomarańczową zatyczką",
    found_at: "Ksero punkt, przy komputerze",
    date_added: generateDate(18),
    date_modified: generateDate(18),
    status: "znalezione"
  },
  {
    person_id: "",
    title: "Zegarek naręczny",
    description: "Analogowy zegarek męski na brązowym skórzanym pasku",
    found_at: "Pociąg relacji Bydgoszcz-Gdańsk, wagon 3",
    date_added: generateDate(19),
    date_modified: generateDate(19),
    status: "znalezione"
  },
  {
    person_id: "",
    title: "Legitymacja studencka",
    description: "Legitymacja UTP, nazwisko Mateusz Wójcik",
    found_at: "Kampus Politechniki, budynek A",
    date_added: generateDate(20),
    date_modified: generateDate(20),
    status: "znalezione"
  },
  {
    person_id: "",
    title: "Etui na okulary",
    description: "Twarde etui na okulary w kolorze niebieskim",
    found_at: "Przychodnia lekarska, poczekalnia",
    date_added: generateDate(21),
    date_modified: generateDate(21),
    status: "znalezione"
  },
  {
    person_id: "",
    title: "Portmonetka",
    description: "Mała, materiałowa portmonetka z monetami",
    found_at: "Targowisko, przy kasie cukierni",
    date_added: generateDate(22),
    date_modified: generateDate(22),
    status: "znalezione"
  },
  {
    person_id: "",
    title: "Smycz z identyfikatorem",
    description: "Czerwona smycz z plakietką firmową 'ACME'",
    found_at: "Biuro, sala konferencyjna",
    date_added: generateDate(23),
    date_modified: generateDate(23),
    status: "znalezione"
  },
  {
    person_id: "",
    title: "Chustka",
    description: "Jedwabna chustka w kratę, kolory beż i brąz",
    found_at: "Teatr Polski, balkon",
    date_added: generateDate(24),
    date_modified: generateDate(24),
    status: "znalezione"
  },
  {
    person_id: "",
    title: "Ładowarka do telefonu",
    description: "Ładowarka USB-C, biała, nieznana marka",
    found_at: "Lotnisko, strefa ładowania",
    date_added: generateDate(25),
    date_modified: generateDate(25),
    status: "znalezione"
  }
];

console.log('🌱 Seeding database...');

// Wyczyść tabelę
db.prepare('DELETE FROM found_items').run();

// Wstaw dane
const insert = db.prepare(`
  INSERT INTO found_items (person_id, title, description, found_at, date_added, date_modified, status)
  VALUES (@person_id, @title, @description, @found_at, @date_added, @date_modified, @status)
`);

const insertMany = db.transaction((items) => {
  for (const item of items) insert.run(item);
});

insertMany(sampleItems);

console.log(`✅ Dodano ${sampleItems.length} przykładowych przedmiotów.`);