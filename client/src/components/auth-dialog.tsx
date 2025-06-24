import React, { useState } from 'react';
import supabase from '../config/supabase';

interface AuthDialogProps {
  open: boolean;
  mode: 'login' | 'signup';
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ open, mode, onClose, onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (mode === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else {
        onAuthSuccess(data.user);
        onClose();
      }
    } else {
      // Sign up with email, password, and username (store username in user_metadata)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } }
      });
      if (error) setError(error.message);
      else {
        onAuthSuccess(data.user);
        onClose();
      }
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ background: '#18181b', padding: 32, borderRadius: 12, minWidth: 320, boxShadow: '0 2px 16px #0008', color: '#fff', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 12, background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>&times;</button>
        <h2 style={{ marginBottom: 16 }}>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              style={{ padding: 8, borderRadius: 4, border: '1px solid #333', background: '#222', color: '#fff' }}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ padding: 8, borderRadius: 4, border: '1px solid #333', background: '#222', color: '#fff' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ padding: 8, borderRadius: 4, border: '1px solid #333', background: '#222', color: '#fff' }}
          />
          <button type="submit" disabled={loading} style={{ padding: '8px 0', borderRadius: 4, background: '#22d3ee', color: '#18181b', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            {loading ? (mode === 'login' ? 'Logging in...' : 'Signing up...') : (mode === 'login' ? 'Login' : 'Sign Up')}
          </button>
          {error && <span style={{ color: 'red', marginTop: 4 }}>{error}</span>}
        </form>
      </div>
    </div>
  );
};

export default AuthDialog; 