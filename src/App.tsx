import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import Dashboard from './Dashboard';
import FoodPage from './components/FoodPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FoodPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;