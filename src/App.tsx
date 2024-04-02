import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FoodPage from './components/FoodPage';
import LoginPage from './components/LoginPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FoodPage />} />
        <Route path="/login" element={<LoginPage />} />
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;