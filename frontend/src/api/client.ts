const API_URL = 'http://localhost:3001/api';

export const api = {
  // Users
  async getUsers() {
    const response = await fetch(`${API_URL}/users`);
    return response.json();
  },

  async register(username: string, password: string, name: string) {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, name }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Błąd rejestracji');
    }
    return response.json();
  },

  async login(username: string, password: string) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Nieprawidłowe dane logowania');
    }
    return response.json();
  },

  // Items
  async getItems() {
    const response = await fetch(`${API_URL}/items`);
    if (!response.ok) throw new Error('Błąd pobierania przedmiotów');
    return response.json();
  },

  async addItem(item: any) {
    const response = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Błąd dodawania przedmiotu');
    return response.json();
  },

  async updateItem(id: number | string, updates: any) {
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Błąd aktualizacji przedmiotu');
    return response.json();
  },

  async resetDatabase() {
    const response = await fetch(`${API_URL}/reset`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Błąd resetowania bazy');
    return response.json();
  },

  async deleteItem(id: number | string) {
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Błąd usuwania przedmiotu');
    return response.json();
  }
};

