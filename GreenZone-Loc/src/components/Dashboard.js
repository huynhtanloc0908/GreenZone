import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Package, Users, TrendingUp, Shield, Globe } from 'lucide-react';

const Dashboard = ({ isConnected, account }) => {
  const stats = [
    {
      icon: <Package size={24} />,
      title: 'Tổng sản phẩm',
      value: '1,234',
      color: '#667eea'
    },
    {
      icon: <Users size={24} />,
      title: 'Nông dân tham gia',
      value: '567',
      color: '#28a745'
    },
    {
      icon: <Shield size={24} />,
      title: 'Sản phẩm đã xác thực',
      value: '890',
      color: '#ffc107'
    },
    {
      icon: <TrendingUp size={24} />,
      title: 'Giao dịch hôm nay',
      value: '123',
      color: '#dc3545'
    }
  ];

  const features = [
    {
      icon: <Leaf size={32} />,
      title: 'Đăng ký sản phẩm',
      description: 'Đăng ký thông tin nông sản lên blockchain với đầy đủ thông tin nguồn gốc',
      link: '/register'
    },
    {
      icon: <Package size={32} />,
      title: 'Quản lý sản phẩm',
      description: 'Xem và quản lý tất cả sản phẩm đã đăng ký trong hệ thống',
      link: '/dashboard'
    },
    {
      icon: <Users size={32} />,
      title: 'Chuỗi cung ứng',
      description: 'Theo dõi toàn bộ quá trình từ sản xuất đến tiêu thụ',
      link: '/supply-chain'
    }
  ];

  return (
    <div className="dashboard">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            GreenZone - Nền tảng Blockchain cho Nông sản
          </h1>
          <p className="hero-description">
            Minh bạch, an toàn và bảo mật thông tin nông sản với công nghệ blockchain.
            Theo dõi chuỗi cung ứng từ nông trại đến bàn ăn.
          </p>
          {!isConnected ? (
            <div className="hero-actions">
              <div className="alert alert-info">
                <Globe size={20} />
                <span>Vui lòng kết nối MetaMask để sử dụng các tính năng</span>
              </div>
            </div>
          ) : (
            <div className="hero-actions">
              <Link to="/register" className="btn btn-success">
                <Leaf size={16} />
                Đăng ký sản phẩm mới
              </Link>
              <Link to="/dashboard" className="btn btn-secondary">
                <Package size={16} />
                Xem sản phẩm
              </Link>
            </div>
          )}
        </div>
        <div className="hero-image">
          <div className="hero-graphic">
            <Leaf size={80} className="hero-icon" />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <h2 className="section-title">Thống kê tổng quan</h2>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-title">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="section-title">Tính năng chính</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <Link to={feature.link} className="btn btn-primary">
                Khám phá ngay
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="benefits-section">
        <h2 className="section-title">Lợi ích của GreenZone</h2>
        <div className="benefits-grid">
          <div className="benefit-item">
            <div className="benefit-icon">
              <Shield size={24} />
            </div>
            <h3>Minh bạch</h3>
            <p>Thông tin sản phẩm được lưu trữ trên blockchain, không thể thay đổi</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <TrendingUp size={24} />
            </div>
            <h3>Hiệu quả</h3>
            <p>Tự động hóa quy trình quản lý và theo dõi chuỗi cung ứng</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <Globe size={24} />
            </div>
            <h3>Toàn cầu</h3>
            <p>Hệ thống hoạt động trên toàn thế giới với công nghệ blockchain</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 