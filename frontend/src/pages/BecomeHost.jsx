import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitHostApplication, getMyApplicationStatus } from '@/api/hostApplications';

const applicationSchema = z.object({
  offeringType: z.enum(['space', 'event', 'both'], {
    required_error: 'Please select what you would like to host',
  }),
  spaceTypes: z.array(z.string()).min(1, 'Select at least one space type'),
  categories: z.array(z.string()).min(1, 'Select at least one category'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  notes: z
    .string()
    .min(
      20,
      'Please provide a short explanation of your interest in becoming a host (at least 20 characters)'
    ),
});

export default function BecomeHost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [loading, setLoading] = useState(true);

 // Check if user already has an application
useEffect(() => {
  let cancelled = false;

  const loadStatus = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // NOTE: your apiClient interceptor returns response.data already
      const status = await getMyApplicationStatus();
      if (!cancelled) setApplicationStatus(status);
    } catch {
      if (!cancelled) setApplicationStatus(null);
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  loadStatus();

  return () => {
    cancelled = true;
  };
}, [user]);

  // If already a host/admin, redirect to dashboard
  useEffect(() => {
    if (user?.role === 'host' || user?.role === 'admin') {
      navigate('/host');
    }
  }, [user, navigate]);

  // Public user (not logged in) - Show info page
  if (!user) {
    return <BecomeHostInfoPage />;
  }

  // Loading application status
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-700">Loading...</div>
      </div>
    );
  }

  // User has an existing application
  if (applicationStatus) {
    return <ApplicationStatus application={applicationStatus} />;
  }

  // User is logged in and has no application - show form
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold font-display text-primary-300 mb-4">Host Application</h1>
        <p className="text-primary-300 mb-8">What would you like to offer on Your Place?.</p>

        <HostApplicationForm />
      </div>
    </div>
  );
}

// Info page for public users
function BecomeHostInfoPage() {
  return (
    <div className="bg-primary-300 min-h-full py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Hero Section */}
        <div className="bg-primary-100 rounded-lg shadow-lg shadow-primary-200 p-8 mb-8 text-center">
          <h1 className="text-4xl font-bold font-display text-secondary-200 mb-4">
            Become a Host on Your Place
          </h1>
          <p className="text-lg text-secondary-200 mb-6">
            Share your space or host events to connect with your community and earn income.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-primary-200 hover:bg-primary-300 text-primary-100 font-semibold px-8 py-4 rounded-lg shadow-lg shadow-primary-200/50 transition-colors"
            >
              Sign Up to Get Started
            </Link>
            <Link
              to="/login"
              state={{ from: '/become-host' }}
              className="bg-primary-100 hover:bg-secondary-100 text-primary-300 font-semibold px-8 py-4 rounded-lg border-2 border-primary-300 transition-colors"
            >
              Already Have an Account? Login
            </Link>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-secondary-100 rounded-lg border-4 border-primary-200/50 shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold font-display text-secondary-200 mb-6">How It Works</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-200 text-primary-100 rounded-full flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">Create Your Account</h3>
                <p className="text-secondary-200">Sign up for a free Your Place account!</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-200 text-primary-100 rounded-full flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">Submit Your Application</h3>
                <p className="text-secondary-200">
                  Tell us about your space and why you want to become a host.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-200 text-primary-100 rounded-full flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">Get Approved</h3>
                <p className="text-secondary-200">Our team reviews your application.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-200 text-primary-100 rounded-full flex items-center justify-center font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">Start Hosting</h3>
                <p className="text-secondary-200">Create listings and start welcoming guests!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-primary-100 rounded-lg shadow-lg shadow-primary-200 p-8">
          <h2 className="text-3xl font-bold font-display text-secondary-200 mb-6">
            Why Host on Your Place?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-black mb-2">Earn Extra Income</h3>
              <p className="text-secondary-200">
                Turn your space into an investment. Set your own prices.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-black mb-2">Build Community</h3>
              <p className="text-secondary-200">
                Connect with people and create memorable experiences.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-black mb-2">Full Control</h3>
              <p className="text-secondary-200">You decide availability and who can book.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Application form component
function HostApplicationForm() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      spaceTypes: [],
      categories: [],
      capacity: 10,
    },
  });

  const offeringType = watch('offeringType');

  const onSubmit = async (data) => {
    try {
      setError('');

      await submitHostApplication({
        offering_type: data.offeringType,
        space_types: data.spaceTypes,
        categories: data.categories,
        capacity: data.capacity,
        notes: data.notes,
      });

      setSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/become-host');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
        <p className="text-gray-600">We&apos;ll review your application and get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Offering Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          What do you want to offer? *
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              value="space"
              {...register('offeringType')}
              className="h-4 w-4 text-primary-200 focus:ring-primary-200"
            />
            <span className="ml-2 text-gray-700">Spaces only</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="event"
              {...register('offeringType')}
              className="h-4 w-4 text-primary-200 focus:ring-primary-200"
            />
            <span className="ml-2 text-gray-700">Events only</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="both"
              {...register('offeringType')}
              className="h-4 w-4 text-primary-200 focus:ring-primary-200"
            />
            <span className="ml-2 text-gray-700">Both spaces and events</span>
          </label>
        </div>
        {errors.offeringType && (
          <p className="text-red-600 text-sm mt-1">{errors.offeringType.message}</p>
        )}
      </div>

      {/* Space Types (only show if offering spaces) */}
      {(offeringType === 'space' || offeringType === 'both') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What type of space(s) do you have? *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['Private Room', 'Backyard/Garden', 'Studio', 'Venue', 'Workshop', 'Other'].map(
              (type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    value={type}
                    {...register('spaceTypes')}
                    className="h-4 w-4 text-primary-200 focus:ring-primary-200 rounded"
                  />
                  <span className="ml-2 text-gray-700">{type}</span>
                </label>
              )
            )}
          </div>
          {errors.spaceTypes && (
            <p className="text-red-600 text-sm mt-1">{errors.spaceTypes.message}</p>
          )}
        </div>
      )}

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          What categories does your offering fit? *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            'Creative',
            'Movement',
            'Social/Community',
            'Learning/Study',
            'Relaxation/Wellness',
            'Outdoors/Nature',
          ].map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                value={category}
                {...register('categories')}
                className="h-4 w-4 text-primary-200 focus:ring-primary-200 rounded"
              />
              <span className="ml-2 text-gray-700">{category}</span>
            </label>
          ))}
        </div>
        {errors.categories && (
          <p className="text-red-600 text-sm mt-1">{errors.categories.message}</p>
        )}
      </div>

      {/* Capacity */}
      <div>
        <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
          Maximum Capacity *
        </label>
        <input
          type="number"
          id="capacity"
          {...register('capacity', { valueAsNumber: true })}
          min="1"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent"
          placeholder="10"
        />
        {errors.capacity && <p className="text-red-600 text-sm mt-1">{errors.capacity.message}</p>}
        <p className="text-xs text-gray-500 mt-1">
          How many people can your space/event accommodate?
        </p>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Tell us about your offering *
        </label>
        <textarea
          id="notes"
          {...register('notes')}
          rows={6}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent"
          placeholder="Tell us about your space, your experience, and why you want to become a host..."
        />
        {errors.notes && <p className="text-red-600 text-sm mt-1">{errors.notes.message}</p>}
        <p className="text-xs text-gray-500 mt-1">Minimum 20 characters</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary-200 hover:bg-primary-300 text-white font-semibold py-3 px-6 rounded-lg shadow-lg shadow-primary-200/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
      </button>
    </form>
  );
}

// Application status component
function ApplicationStatus({ application }) {
  const statusColors = {
    pending: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    approved: 'bg-green-50 border-green-200 text-green-800',
    rejected: 'bg-red-50 border-red-200 text-red-800',
  };

  const statusMessages = {
    pending: {
      title: 'Application Under Review',
      message:
        "Your application is being reviewed by our team. We'll notify you once a decision is made.",
    },
    approved: {
      title: 'Application Approved!',
      message: 'Congratulations! Your application has been approved. You can now create listings.',
    },
    rejected: {
      title: 'Application Not Approved',
      message: 'Unfortunately, your application was not approved at this time.',
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className={`${statusColors[application.status]} border rounded-lg p-6 mb-6`}>
          <h2 className="text-2xl font-bold mb-2">{statusMessages[application.status].title}</h2>
          <p>{statusMessages[application.status].message}</p>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Your Application</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <p>
                <span className="font-medium">Offering:</span> {application.offering_type}
              </p>
              <p>
                <span className="font-medium">Space Types:</span>{' '}
                {application.space_types?.join(', ') || 'N/A'}
              </p>
              <p>
                <span className="font-medium">Categories:</span>{' '}
                {application.categories?.join(', ')}
              </p>
              <p>
                <span className="font-medium">Capacity:</span> {application.capacity}
              </p>
              <p>
                <span className="font-medium">Submitted:</span>{' '}
                {new Date(application.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {application.review_notes && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Review Notes</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <p>{application.review_notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
