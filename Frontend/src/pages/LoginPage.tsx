import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/Toast';
import { authAPI } from '../services/api';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
}

export function LoginPage({ onLogin, onNavigateToRegister, onNavigateToForgotPassword }: LoginPageProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(formData.email, formData.password);
      showToast('Login successful!', 'success');
      onLogin(response.user);
    } catch (error: any) {
      showToast(error.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Campus Resource Management</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            placeholder="Enter your email"
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            placeholder="Enter your password"
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <button
            onClick={onNavigateToForgotPassword}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Forgot password?
          </button>
          <div className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onNavigateToRegister}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Register here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
