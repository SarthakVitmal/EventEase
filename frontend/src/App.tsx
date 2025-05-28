import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import Landing from './pages/Home';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import DashboardPage from './pages/Dashboard';
import CreateEventPage from './pages/Create-Event';
import EventsPage from './pages/Events';
import ViewEvent from './pages/View-Event';
import { Test } from './pages/Test';
import AllEventsPage from './pages/All-Events';
import EventRegistrationPage from './pages/Event-Registration';
import TicketsPage from './pages/Tickets';
import ManageEventsPage from './pages/Manage-Event';

function AppContent() {
  const location = useLocation();
  const hideHeader = location.pathname.startsWith('/dashboard');

  return (
    <div className="font-[Montserrat] flex min-h-screen flex-col">
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<Landing />} />
        <Route path="/test" element={<Test />} />
        <Route path="/dashboard/*" element={<DashboardPage />} />
        <Route path="/dashboard/create-event" element={<CreateEventPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<ViewEvent />} />
        <Route path="/dashboard/all-events" element={<AllEventsPage/>} />
        <Route path="/dashboard/all-events/:id" element={<ViewEvent />} />
        <Route path="/dashboard/all-events/:id/register" element={<EventRegistrationPage />} />
        <Route path="/dashboard/ticket-history" element={<TicketsPage />} />
        <Route path="/dashboard/manage-events" element={<ManageEventsPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
