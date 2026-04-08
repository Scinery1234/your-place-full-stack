import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="grid min-h-full place-items-center bg-secondary-200 px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-primary-200">404</p>
        <h1 className="mt-4 text-5xl font-semibold font-display tracking-tight text-balance text-primary-100 sm:text-7xl">
          Page not found
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-secondary-100 sm:text-xl/8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            className="rounded-md bg-primary-200 px-3.5 py-2.5 text-sm font-semibold text-primary-100 shadow-lg shadow-primary-200/50 hover:bg-primary-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-200 transition-colors"
          >
            Go back home
          </Link>
          <Link
            to="/contact-us"
            className="text-sm font-semibold text-primary-100 hover:text-secondary-100 transition-colors"
          >
            Contact support <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
