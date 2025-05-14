import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FoodPage from './components/FoodPage';
import AuthPage from './components/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FoodPage />} />
        <Route path="/auth" element={<AuthPage />} /> {}
      </Routes>
    </BrowserRouter>
  );
}


export default App;