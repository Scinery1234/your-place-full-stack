import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-primary-100">
      <Navbar />

      {/* Main content area - grows or shrinks to fill screen space */}
      <main className="flex-grow">
        <Outlet /> {/* Child route */}
      </main>

      <Footer />
    </div>
  );
}
