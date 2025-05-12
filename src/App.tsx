import { BrowserRouter, Routes, Route } from "react-router-dom";
import FoodPage from "./components/FoodPage";
import AuthenticatePage from "./components/AuthenticatePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthenticatePage />} />
        <Route path="/foods" element={<FoodPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
