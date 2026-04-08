import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-100 border-t border-primary-200/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          {/* Your Place logo - links to Homepage*/}
          <Link
            to="/"
            className="text-primary-300 text-xl font-bold hover:text-primary-200 transition-colors"
          >
            Your Place
          </Link>

          {/* Copyright */}
          <p className="text-sm text-primary-300">
            @ {currentYear} Your Place. All rights reserved.
          </p>

          {/* Contact Us link */}
          <Link
            to="/contact-us"
            className="text-primary-300 text-xl font-bold hover:text-primary-200 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
}
