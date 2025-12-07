const API_URL = '/api';

export const api = {
  // Users
  async getUsers() {
    const response = await fetch(`${API_URL}/users`);
    return response.json();
  },

  async register(username: string, password: string, name: string) {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, name }),
    });
    if (!response.ok) throw new Error('Błąd rejestracji');
    return response.json();
  },

  async login(username: string, password: string) {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error('Nieprawidłowe dane logowania');
    return response.json();
  },

  // Items
  async getItems() {
    const response = await fetch(`${API_URL}/items`);
    return response.json();
  },

  async getActiveItems() {
    const response = await fetch(`${API_URL}/items/active`);
    return response.json();
  },

  async getIssuedItems() {
    const response = await fetch(`${API_URL}/items/issued`);
    return response.json();
  },

  async addItem(item: any) {
    const response = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: item.id,
        category: item.category,
        description: item.description,
        location: item.location,
        date: item.date,
        personal_code: item.personalCode,
        submitted_by: item.submittedBy,
        submitted_at: item.submittedAt,
      }),
    });
    if (!response.ok) throw new Error('Błąd dodawania przedmiotu');
    return response.json();
  },

  async issueItem(id: string, issued_at: string) {
    const response = await fetch(`${API_URL}/items/${id}/issue`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ issued_at }),
    });
    if (!response.ok) throw new Error('Błąd wydawania przedmiotu');
    return response.json();
  },

  async deleteItem(id: string) {
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Błąd usuwania przedmiotu');
    return response.json();
  },
};
