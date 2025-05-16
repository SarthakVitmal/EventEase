import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Landing from './pages/Home';
import LoginPage from './pages/Login';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
