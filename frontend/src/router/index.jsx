import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Explore from '@/pages/Explore';
import ContactUs from '@/pages/ContactUs';
import ListingDetail from '@/pages/ListingDetail';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import BecomeHost from '@/pages/BecomeHost';
import MyBookings from '@/pages/MyBookings';
import HostDashboard from '@/pages/HostDashboard';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/common/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'explore', element: <Explore /> },
      { path: 'contact-us', element: <ContactUs /> },
      { path: 'listings/:type/:id', element: <ListingDetail /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      {
        path: 'become-host',
        element: <BecomeHost />,
      },
      {
        path: 'bookings',
        element: (
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        ),
      },
      {
        path: 'host',
        element: (
          <ProtectedRoute role="host">
            <HostDashboard />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default router;
