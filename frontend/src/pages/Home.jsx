import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Home() {
  const { login, logout } = useAuth();

  return (
    <div className="bg-primary-300 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-secondary-100/50 p-8 rounded-lg shadow-lg">
          <h1
            className="
          text-5xl 
          sm:text-5xl 
          md:text-7xl
          lg:text-9xl
          xl:text-10xl
          font-bold font-logo bg-clip-text text-transparent bg-gradient-to-r 
          from-blue-400 to-primary-100 mb-6 drop-shadow-lg drop-shadow-secondary-200 text-center"
          >
            Your Place
          </h1>
          <h2 className="text-2xl font-display font-bold text-primary-100 mb-4 text-center">
            Find the perfect space - or share yours! Discover experiences, from themed and purpose
            built rooms, to curated events. It&apos;s all waiting for you at Your Place.
          </h2>
          <div className="mt-6 w-full flex flex-col gap-3">
            <Link
              to="/explore"
              className="block w-full bg-primary-100 hover:bg-primary-100/75 text-secondary-200 text-xl font-semibold hover:font-bold px-6 py-3 rounded-lg shadow-lg shadow-primary-200/50 transition-colors text-center"
            >
              Find out what&apos;s in your area - Explore now!
            </Link>
          </div>
        </div>
        <div className="bg-primary-200/75 p-8 rounded-lg shadow-lg">
          <p className="text-l font-sans font-semibold text-primary-100 mb-4">
            Want to become a host? Or keen to make a booking? Do more when you{' '}
            <Link
              to="/register"
              className="underline decoration-2 underline-offset-4 hover:font-bold transition-all"
            >
              create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
