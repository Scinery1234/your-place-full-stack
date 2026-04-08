// Placeholder Page
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full nme must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    // locale to be set as 'en' as default (option to integrate when scaling)
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passowrd don't match",
    path: ['confirmPassword'],
  });

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      setError('');

      // Prepare data for backend
      const userData = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        locale: 'en', // ← Hardcoded to 'en'
      };

      await registerUser(userData);

      // Redirect to home after successful registration
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
    }
  };

  return (
    <div className="bg-primary-300 min-h-full flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Register Form - 2 columns on large screens */}
        <div className="lg:col-span-2 bg-primary-100 rounded-lg shadow-lg shadow-primary-100/50 p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-display text-secondary-200 mb-2">
              Create Account
            </h1>
            <p className="text-secondary-200">Join us! Let&apos;s get you started:</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-secondary-200 mb-2"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                {...register('fullName')}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent"
                placeholder="John Smith"
              />
              {errors.fullName && (
                <p className="text-red-600 text-sm mt-1">{errors.fullName.message}</p>
              )}
            </div>

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
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-secondary-200 mb-2"
              >
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...register('confirmPassword')}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-200 hover:bg-primary-300 text-primary-100 font-semibold py-3 px-6 rounded-lg shadow-lg shadow-primary-200/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Login Card - 1 right side column on large screens */}
        <div className="lg:col-span-1 bg-primary-100 rounded-lg shadow-lg shadow-primary-100/50 p-8 flex flex-col justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold font-display text-secondary-200 mb-4">
              Already have an account?
            </h2>
            <p className="text-secondary-200 mb-6">
              Login to access your bookings and explore new experiences. Or if you are one of our
              hosts, login to view your dashboard!
            </p>
            <Link
              to="/login"
              className="inline-block w-full bg-primary-300 hover:bg-primary-200 text-primary-100 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
