import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { LogIn } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => boolean;
  onCancel: () => void;
  onSwitchToRegister: () => void;
}

export function LoginForm({ onLogin, onCancel, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Proszę wypełnić wszystkie pola');
      return;
    }
    
    const success = onLogin(email, password);
    if (!success) {
      setError('Nieprawidłowy email lub hasło');
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <LogIn className="size-6 text-blue-600" />
        <h2 className="text-gray-900">Logowanie</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="twoj@email.pl"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="login-password">Hasło</Label>
          <Input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">
            Zaloguj się
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Anuluj
          </Button>
        </div>
        
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-sm text-blue-600 hover:underline"
          >
            Nie masz konta? Zarejestruj się
          </button>
        </div>
      </form>
    </div>
  );
}
