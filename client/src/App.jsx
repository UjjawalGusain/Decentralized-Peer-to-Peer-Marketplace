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
import UserProfilePage from './components/UserProfilePage';
import UserProfileUpdate from './components/UserProfileUpdate';
import SellerDashboard from './components/SellerDashboard';
import BuyerDashboard from './components/BuyerDashboard';
import ChatPage from './components/ChatPage';

function App() {
  const [search, setSearch] = useState("");

  return (
    <Router>
      {/* Root container full screen flex */}
      <div className="flex flex-col h-screen">
        <Header search={search} setSearch={setSearch} />
        {/* Main content fills rest of screen, scrollable if needed */}
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginRegister />} />
            <Route path="/register" element={<LoginRegister />} />
            <Route path="/browse" element={<BrowsePage search={search} />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/browse/:id" element={<ProductSpecificPage />} />
            <Route path="/users/:id" element={<UserProfilePage />} />
            <Route path="/users/:id/update" element={<UserProfileUpdate />} />
            <Route path="/users/:id/sellerdashboard" element={<SellerDashboard />} />
            <Route path="/users/:id/buyerdashboard" element={<BuyerDashboard />} />
            <Route path="/chat/:id?" element={<ChatPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}


export default App
