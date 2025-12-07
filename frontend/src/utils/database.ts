interface FoundItem {
  id: number;
  person_id: string;
  title: string;
  description: string;
  found_at: string;
  date_added: string;
  date_modified: string;
  status: 'znalezione' | 'wydane';
}

// Funkcja pomocnicza do formatowania daty
export const formatDateTime = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Funkcja do generowania unikalnego ID
export const generateId = (): number => {
  const items: FoundItem[] = JSON.parse(localStorage.getItem('foundItems') || '[]');
  if (items.length === 0) return 1;
  const maxId = Math.max(...items.map(item => item.id));
  return maxId + 1;
};

export const initializeDatabase = () => {
  // Inicjalizacja pustej listy jeśli nie istnieje
  if (!localStorage.getItem('foundItems')) {
    localStorage.setItem('foundItems', '[]');
  }
};

export const sendEmail = (to: string, subject: string, body: string) => {
  console.log('Email wysłany do:', to);
  console.log('Temat:', subject);
  console.log('Treść:', body);
};

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    electronics: 'Elektronika',
    documents: 'Dokumenty',
    keys: 'Klucze',
    accessories: 'Akcesoria',
    clothing: 'Odzież',
    bags: 'Torby i plecaki',
    other: 'Inne',
  };
  
  const label = labels[category];
  if (!label) {
    return category;
  }
  return label;
};

export type { FoundItem };