# Odnalezione Zguby

Koncepcja ogólnopolskiego systemu znalezionych rzeczy, zintegrowanego z [dane.gov.pl](dane.gov.pl). Projekt powstał na **HackNation 2025**.<br>
[Demo](https://pale-floor-13699014.figma.site/) (działa w przeglądarce na localStorage, można założyć konto i wszystko przetestować)

<img width="2253" height="1311" alt="Odnalezione Zguby - ekran główny" src="https://github.com/user-attachments/assets/d0425ea9-ffc8-45fb-9ece-4b45293f3e04" />

## O projekcie

Informacje o znalezionych rzeczach są dziś rozproszone, a osoba, która coś zgubiła, ma trudność z ustaleniem, gdzie i u kogo tego szukać. Projekt pokazuje, jak mógłby wyglądać jeden spójny system, który obsługuje cały proces: przyjęcie rzeczy, weryfikację właściciela i jej wydanie. Dane o rzeczach są udostępniane jako otwarte dane w standardzie dane.gov.pl.

## Funkcje

- Zgłaszanie znalezionych rzeczy przez formularz
- Wydawanie rzeczy po weryfikacji numeru PESEL
- Eksport danych do CSV zgodnego ze standardem dane.gov.pl
- Rejestracja i logowanie użytkowników
- Trwałe przechowywanie danych w bazie SQLite

## Hackathon

HackNation 2025<br>
[Bartek Dylewski](https://github.com/bartekdylewski) & [Julia Majdańska](https://github.com/juls-s05)<br>

## Struktura i technologie

```
backend/    API: Node.js, Express, SQLite (better-sqlite3)
frontend/   Interfejs: React 18, Vite, React Router, Radix UI, Tailwind CSS
```
