// Guest Pages
import LandingPage from '../pages/LandingPage';
import ListingPage from '../pages/ListingPage';
import HotelDetails from '../pages/HotelDetails';
import BookingPage from '../pages/BookingPage';
import GuestProfile from '../pages/GuestProfile';
import MyBookings from '../pages/MyBookings';
import MessagesPage from '../pages/MessagesPage';
import NotificationsPage from '../pages/NotificationsPage';
import BookingSuccess from '../pages/BookingSuccess';

// Host Pages
import HostProperties from '../pages/host/HostProperties';
import AddProperty from '../pages/host/AddProperty';
import HostReservations from '../pages/host/HostReservations';
import HostDashboard from '../pages/host/HostDashboard';
import HostTransactions from '../pages/host/HostTransactions';

// This map allows us to render components dynamically based on the string name
// stored in the database (e.g., "HostDashboard" -> <HostDashboard />)
export const COMPONENT_MAP = {
  // Public
  'LandingPage': LandingPage,
  'ListingPage': ListingPage,
  'HotelDetails': HotelDetails,
  
  // Guest
  'BookingPage': BookingPage,
  'BookingSuccess': BookingSuccess,
  'GuestProfile': GuestProfile,
  'MyBookings': MyBookings,
  'MessagesPage': MessagesPage,
  'NotificationsPage': NotificationsPage,

  // Host
  'HostProperties': HostProperties,
  'AddProperty': AddProperty,
  'HostReservations': HostReservations,
  'HostDashboard': HostDashboard,
  'HostTransactions': HostTransactions
};