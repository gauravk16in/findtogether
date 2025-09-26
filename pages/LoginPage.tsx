import React, { useState } from 'react';
import { useAuth } from '../src/contexts/AuthContext';
import CloseIcon from '../components/icons/CloseIcon';
import FindTogetherIcon from '../components/icons/FindTogetherIcon';

interface LoginPageProps {
  onClose: () => void;
  onLoginSuccess: () => void;
  context?: 'report' | 'general';
}

const FormField: React.FC<{ 
  id: string; 
  label: string; 
  type: string; 
  required?: boolean; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ id, label, type, required, value, onChange }) => (
  <div>
    <label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label}{required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      required={required}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-black/80 focus:border-black/80"
    />
  </div>
);

const LoginPage: React.FC<LoginPageProps> = ({ onClose, onLoginSuccess, context = 'general' }) => {
  const { signIn, signUp, resetPassword, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (showForgotPassword) {
      // Handle password reset
      if (!email) {
        setError('Please enter your email address');
        return;
      }
      
      const result = await resetPassword(email);
      if (result.success) {
        setMessage(result.message);
        setShowForgotPassword(false);
      } else {
        setError(result.message);
      }
      return;
    }

    if (!email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }

      const result = await signUp(email, password);
      if (result.success) {
        setMessage(result.message);
        onLoginSuccess();
      } else {
        setError(result.message);
      }
    } else {
      const result = await signIn(email, password);
      if (result.success) {
        onLoginSuccess();
      } else {
        setError(result.message);
      }
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setMessage('');
    setShowForgotPassword(false);
  };

  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
    setError('');
    setMessage('');
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
    >
      <div
        className="relative bg-white/95 backdrop-blur-xl w-full max-w-sm rounded-3xl shadow-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        <div className="p-4 md:p-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-black text-white rounded-2xl px-4 py-2 mb-3">
              <span className="text-lg font-bold">FindTogether</span>
            </div>
            <h1 id="login-title" className="text-xl md:text-2xl font-bold text-black">
              {showForgotPassword ? 'Reset Password' : isSignUp ? 'Create Account' : 'Welcome back'}
            </h1>
            <p className="mt-2 text-gray-600">
              {showForgotPassword 
                ? 'Enter your email to reset your password'
                : context === 'report'
                ? isSignUp 
                  ? 'Create an account to report a missing person'
                  : 'Sign in to report a missing person'
                : isSignUp 
                ? 'Sign up for the official portal'
                : 'Sign in to the official portal'
              }
            </p>
            

          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {message}
            </div>
          )}

          <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
            <FormField 
              id="email" 
              label="Email" 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            {!showForgotPassword && (
              <FormField 
                id="password" 
                label="Password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}

            {isSignUp && !showForgotPassword && (
              <>
                <FormField 
                  id="confirmPassword" 
                  label="Confirm Password" 
                  type="password" 
                  required 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </>
            )}
            
            {!showForgotPassword && !isSignUp && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black" />
                  <label htmlFor="remember-me" className="ml-2 block text-gray-900">Remember me</label>
                </div>
                <button
                  type="button"
                  onClick={toggleForgotPassword}
                  className="font-medium text-black hover:underline"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold py-2.5 px-4 rounded-xl hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
            >
              {loading 
                ? 'Loading...' 
                : showForgotPassword 
                ? 'Send Reset Email'
                : isSignUp 
                ? 'Create Account' 
                : 'Sign in'
              }
            </button>
          </form>

          {!showForgotPassword && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
          )}

          {showForgotPassword && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={toggleForgotPassword}
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Back to sign in
              </button>
            </div>
          )}

          <p className="mt-4 text-center text-xs text-gray-500">
            By continuing, you agree to FindTogether's <a href="#" className="underline hover:text-black">Privacy Policy</a> and <a href="#" className="underline hover:text-black">Terms of Service</a>.
          </p>
        </div>
      </div>
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;