import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Wallet, Leaf, Package, Users, Home, Menu, X } from 'lucide-react';
import MetaMaskConnect from './components/MetaMaskConnect';
import Dashboard from './components/Dashboard';
import ProductRegistration from './components/ProductRegistration';
import ProductList from './components/ProductList';
import SupplyChain from './components/SupplyChain';
import './App.css';
import './components.css';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <Router>
      <div className="App">
        {/* Header */}
        <header className="header">
          <div className="container">
            <div className="header-content">
              <div className="logo">
                <Leaf className="logo-icon" />
                <span>GreenZone</span>
              </div>
              
              <nav className={`nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
                <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <Home size={20} />
                  <span>Trang chủ</span>
                </Link>
                <Link to="/dashboard" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <Package size={20} />
                  <span>Sản phẩm</span>
                </Link>
                <Link to="/register" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <Leaf size={20} />
                  <span>Đăng ký</span>
                </Link>
                <Link to="/supply-chain" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <Users size={20} />
                  <span>Chuỗi cung ứng</span>
                </Link>
              </nav>

              <div className="header-actions">
                <MetaMaskConnect 
                  isConnected={isConnected}
                  setIsConnected={setIsConnected}
                  account={account}
                  setAccount={setAccount}
                />
                <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main">
          <div className="container">
            <Routes>
              <Route path="/" element={<Dashboard isConnected={isConnected} account={account} />} />
              <Route path="/dashboard" element={<ProductList isConnected={isConnected} account={account} />} />
              <Route path="/register" element={<ProductRegistration isConnected={isConnected} account={account} />} />
              <Route path="/supply-chain" element={<SupplyChain isConnected={isConnected} account={account} />} />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-section">
                <h3>GreenZone</h3>
                <p>Nền tảng blockchain cho nông sản an toàn và minh bạch</p>
              </div>
              <div className="footer-section">
                <h4>Tính năng</h4>
                <ul>
                  <li>Đăng ký sản phẩm</li>
                  <li>Theo dõi chuỗi cung ứng</li>
                  <li>Xác thực nguồn gốc</li>
                  <li>Quản lý chứng nhận</li>
                </ul>
              </div>
              <div className="footer-section">
                <h4>Liên hệ</h4>
                <p>Email: info@greenzone.vn</p>
                <p>Phone: +84 123 456 789</p>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2024 GreenZone. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App; 