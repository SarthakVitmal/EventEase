import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Landing from './pages/Home';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
function App() {
  return (
   <Router>
      <div className="font-[Montserrat] flex min-h-screen flex-col">
        <Header />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<Landing/>} /> {/* Placeholder for the home page */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
