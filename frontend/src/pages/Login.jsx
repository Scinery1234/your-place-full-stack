import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Get the page they were trying to access (e.g., when user clics login from the Become Host page, they will be redirected to '/become-host' after logging in)
  const from = location.state?.from || '/';

  const onSubmit = async (data) => {
    try {
      setError('');
      await login(data);
      // Redirect to (page) where they came from
      navigate(from);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    }
  };

  return (
    <div className="bg-primary-300 min-h-full flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Login Form - 2 columns on large screens */}
        <div className="lg:col-span-2 bg-primary-100 rounded-lg shadow-lg shadow-primary-100/50 p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-display text-secondary-200 mb-2">
              Welcome Back!
            </h1>
            <p className="text-secondary-200">Login to access your account</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-200 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-secondary-200 mb-2"
              >
                Password *
              </label>
              <input
                type="password"
                id="password"
                {...register('password')}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-primary-200 focus:ring-primary-200 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-secondary-200">
                Remember me
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-200 hover:bg-primary-300 text-primary-100 font-semibold py-3 px-6 rounded-lg shadow-lg shadow-primary-200/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        {/* Sign Up Card - 1 right side column on large screens */}
        <div className="lg:col-span-1 bg-primary-100 rounded-lg shadow-lg shadow-primary-100/50 p-8 flex flex-col justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold font-display text-secondary-200 mb-4">
              Don&apos;t have an account?
            </h2>
            <p className="text-secondary-200 mb-6">
              Join up today to book experiences, or become a host.
            </p>
            <Link
              to="/register"
              className="inline-block w-full bg-primary-300 hover:bg-primary-200 text-primary-100 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
