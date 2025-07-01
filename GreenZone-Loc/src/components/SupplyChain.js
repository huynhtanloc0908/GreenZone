import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, User, Package, Truck, Store, CheckCircle } from 'lucide-react';

const SupplyChain = ({ isConnected, account }) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [supplyChainData, setSupplyChainData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productInfo, setProductInfo] = useState(null);

  // Mock data cho demo
  const mockProducts = [
    { productId: 'PROD-1703123456789-ABC12', name: 'Gạo Jasmine' },
    { productId: 'PROD-1703123456790-DEF34', name: 'Cà phê Robusta' },
    { productId: 'PROD-1703123456791-GHI56', name: 'Tiêu đen' }
  ];

  const mockSupplyChain = {
    'PROD-1703123456789-ABC12': [
      {
        stepId: 'PROD-1703123456789-ABC12-0',
        action: 'REGISTRATION',
        location: 'Đồng Tháp, Việt Nam',
        timestamp: Date.now() - 86400000,
        actor: '0x1234...5678',
        details: 'Sản phẩm được đăng ký trên blockchain'
      },
      {
        stepId: 'PROD-1703123456789-ABC12-1',
        action: 'HARVEST',
        location: 'Đồng Tháp, Việt Nam',
        timestamp: Date.now() - 82800000,
        actor: '0x1234...5678',
        details: 'Thu hoạch lúa từ ruộng'
      },
      {
        stepId: 'PROD-1703123456789-ABC12-2',
        action: 'PROCESSING',
        location: 'Nhà máy xay xát, Đồng Tháp',
        timestamp: Date.now() - 79200000,
        actor: '0x5678...9012',
        details: 'Xay xát và đóng gói gạo'
      },
      {
        stepId: 'PROD-1703123456789-ABC12-3',
        action: 'TRANSPORT',
        location: 'Đường vận chuyển',
        timestamp: Date.now() - 75600000,
        actor: '0x9012...3456',
        details: 'Vận chuyển đến kho trung chuyển'
      },
      {
        stepId: 'PROD-1703123456789-ABC12-4',
        action: 'DISTRIBUTION',
        location: 'TP.HCM',
        timestamp: Date.now() - 72000000,
        actor: '0x3456...7890',
        details: 'Phân phối đến các cửa hàng'
      }
    ]
  };

  useEffect(() => {
    if (selectedProductId) {
      loadSupplyChain(selectedProductId);
    }
  }, [selectedProductId]);

  const loadSupplyChain = async (productId) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const data = mockSupplyChain[productId] || [];
      setSupplyChainData(data);
      
      // Set product info
      const product = mockProducts.find(p => p.productId === productId);
      setProductInfo(product);
      
      setLoading(false);
    }, 1000);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('vi-VN');
  };

  const formatAddress = (address) => {
    return address;
  };

  const getStepIcon = (action) => {
    switch (action) {
      case 'REGISTRATION':
        return <Package size={20} />;
      case 'HARVEST':
        return <CheckCircle size={20} />;
      case 'PROCESSING':
        return <Package size={20} />;
      case 'TRANSPORT':
        return <Truck size={20} />;
      case 'DISTRIBUTION':
        return <Store size={20} />;
      default:
        return <Package size={20} />;
    }
  };

  const getStepColor = (action) => {
    switch (action) {
      case 'REGISTRATION':
        return '#667eea';
      case 'HARVEST':
        return '#28a745';
      case 'PROCESSING':
        return '#ffc107';
      case 'TRANSPORT':
        return '#17a2b8';
      case 'DISTRIBUTION':
        return '#6f42c1';
      default:
        return '#6c757d';
    }
  };

  if (!isConnected) {
    return (
      <div className="card">
        <div className="text-center">
          <Package size={48} className="text-blue" />
          <h2>Kết nối ví để theo dõi chuỗi cung ứng</h2>
          <p>Vui lòng kết nối MetaMask để xem thông tin chuỗi cung ứng.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="supply-chain">
      <div className="page-header">
        <h1>Theo dõi chuỗi cung ứng</h1>
        <p>Xem chi tiết quá trình từ sản xuất đến tiêu thụ</p>
      </div>

      {/* Product Selection */}
      <div className="card">
        <div className="form-group">
          <label className="form-label">
            <Package size={16} />
            Chọn sản phẩm để theo dõi
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="form-input"
          >
            <option value="">-- Chọn sản phẩm --</option>
            {mockProducts.map((product, index) => (
              <option key={index} value={product.productId}>
                {product.name} ({product.productId})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Supply Chain Timeline */}
      {selectedProductId && (
        <div className="card">
          <div className="supply-chain-header">
            <h2>Chuỗi cung ứng: {productInfo?.name}</h2>
            <div className="product-info">
              <span>Mã sản phẩm: {selectedProductId}</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="loading"></div>
              <p>Đang tải thông tin chuỗi cung ứng...</p>
            </div>
          ) : (
            <div className="supply-chain-timeline">
              {supplyChainData.length > 0 ? (
                supplyChainData.map((step, index) => (
                  <div key={step.stepId} className="timeline-item">
                    <div className="timeline-marker" style={{ backgroundColor: getStepColor(step.action) }}>
                      {getStepIcon(step.action)}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <h3 className="step-action">{step.action}</h3>
                        <span className="step-time">{formatDate(step.timestamp)}</span>
                      </div>
                      
                      <div className="step-details">
                        <div className="detail-row">
                          <MapPin size={16} />
                          <span>{step.location}</span>
                        </div>
                        <div className="detail-row">
                          <User size={16} />
                          <span>{formatAddress(step.actor)}</span>
                        </div>
                        <div className="detail-row">
                          <Package size={16} />
                          <span>{step.details}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center">
                  <Package size={48} className="text-blue" />
                  <h3>Chưa có dữ liệu chuỗi cung ứng</h3>
                  <p>Sản phẩm này chưa có thông tin chuỗi cung ứng</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Supply Chain Legend */}
      <div className="card">
        <h3>Chú thích</h3>
        <div className="legend-grid">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#667eea' }}>
              <Package size={16} />
            </div>
            <span>Đăng ký sản phẩm</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#28a745' }}>
              <CheckCircle size={16} />
            </div>
            <span>Thu hoạch</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ffc107' }}>
              <Package size={16} />
            </div>
            <span>Chế biến</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#17a2b8' }}>
              <Truck size={16} />
            </div>
            <span>Vận chuyển</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#6f42c1' }}>
              <Store size={16} />
            </div>
            <span>Phân phối</span>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="card">
        <h3>Lợi ích của việc theo dõi chuỗi cung ứng</h3>
        <div className="benefits-list">
          <div className="benefit-item">
            <CheckCircle size={20} className="text-green" />
            <div>
              <h4>Minh bạch</h4>
              <p>Người tiêu dùng có thể theo dõi toàn bộ quá trình sản xuất</p>
            </div>
          </div>
          <div className="benefit-item">
            <CheckCircle size={20} className="text-green" />
            <div>
              <h4>An toàn</h4>
              <p>Đảm bảo chất lượng và an toàn thực phẩm</p>
            </div>
          </div>
          <div className="benefit-item">
            <CheckCircle size={20} className="text-green" />
            <div>
              <h4>Hiệu quả</h4>
              <p>Tối ưu hóa quy trình sản xuất và phân phối</p>
            </div>
          </div>
          <div className="benefit-item">
            <CheckCircle size={20} className="text-green" />
            <div>
              <h4>Bảo mật</h4>
              <p>Thông tin được lưu trữ an toàn trên blockchain</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyChain; 