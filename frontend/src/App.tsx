import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Landing from './pages/Home';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import DashboardPage from './pages/Dashboard';
import CreateEventPage from './pages/Create-Event';

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
        <Route path="/dashboard/*" element={<DashboardPage />} />
        <Route path="/dashboard/create-event" element={<CreateEventPage />} />
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
