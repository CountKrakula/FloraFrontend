import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { deleteAccount } from '../../service/AuthService';

export const DeleteAccountForm: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await deleteAccount(password);
      navigate('/login');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.Error || 
          err.response?.data?.error || 
          'Incorrect password or failed to delete account.'
        );
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card text-card-foreground border border-border rounded-xl shadow-sm">
      <h3 className="text-xl font-bold text-destructive mb-2">Delete Account</h3>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        This action is <strong className="text-foreground font-semibold">permanent</strong> and cannot be undone. All your data will be permanently removed.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="delete-password" className="text-sm font-medium text-foreground">
            Confirm Password
          </label>
          <input
            id="delete-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-md">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!password}
          className="w-full py-2.5 px-4 bg-destructive text-white font-medium text-sm rounded-md hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Delete My Account
        </button>
      </form>
    </div>
  );
};