import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import Home from './components/Home';
import LoginRegister from './components/LoginRegister';
import Header from './components/Header';
import BrowsePage from './components/BrowsePage';
import AboutUs from './components/AboutUs';
import Sell from './components/Sell';
import ProductSpecificPage from './components/ProductSpecificPage';

function App() {
  const [search, setSearch] = useState("");
  return (
    <Router>
      <Header search={search} setSearch={setSearch} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/register" element={<LoginRegister />} />
        <Route 
          path="/browse" 
          element={<BrowsePage search={search} />}  // Pass search down
        />
        <Route path="/sell" element={<Sell />}/>
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/browse/:id" element={<ProductSpecificPage />} />
      </Routes>
    </Router>
  )
}

export default App
