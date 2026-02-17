import React, { useState } from 'react';
import { GraduationCap, Lock, Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/Toast';
import { mockUsers } from '../utils/mockData';
import { User } from '../types';
interface LoginPageProps {
  onLogin: (user: User, token: string) => void;
}
export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const user = mockUsers.find((u) => u.email === email);
      if (user) {
        if (user.status === 'INACTIVE') {
          showToast(
            'Your account is inactive. Please contact support.',
            'error'
          );
          setIsLoading(false);
          return;
        }
        // Simple password check simulation (in real app, backend handles this)
        // For demo: password must be "password" or match the hint
        const isValidPassword =
        password === 'password' ||
        email === 'admin@campus.edu' && password === 'admin123' ||
        email === 'staff@campus.edu' && password === 'staff123' ||
        email === 'student@campus.edu' && password === 'student123';
        if (isValidPassword) {
          showToast(`Welcome back, ${user.name}!`, 'success');
          onLogin(user, 'mock-jwt-token-12345');
        } else {
          showToast('Invalid password. Try the demo credentials.', 'error');
        }
      } else {
        showToast('User not found.', 'error');
      }
      setIsLoading(false);
    }, 1000);
  };
  const fillDemo = (email: string, pass: string) => {
    setEmail(email);
    setPassword(pass);
  };
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-[#1e3a5f] p-3 rounded-full">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#1e3a5f]">
          Campus Resource System
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to manage bookings and resources
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Input
                label="Email address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="pl-10" />

            </div>

            <div>
              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="pl-10" />

            </div>

            <div>
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Sign in
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Demo Credentials
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                onClick={() => fillDemo('admin@campus.edu', 'admin123')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">

                <span className="font-bold text-[#1e3a5f] mr-2">Admin:</span>{' '}
                admin@campus.edu
              </button>
              <button
                onClick={() => fillDemo('staff@campus.edu', 'staff123')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">

                <span className="font-bold text-[#1e3a5f] mr-2">Staff:</span>{' '}
                staff@campus.edu
              </button>
              <button
                onClick={() => fillDemo('student@campus.edu', 'student123')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">

                <span className="font-bold text-[#1e3a5f] mr-2">Student:</span>{' '}
                student@campus.edu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);

}