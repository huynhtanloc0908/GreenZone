import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit, Trash2, Calendar, MapPin, User, Shield, Package } from 'lucide-react';
import { ethers } from 'ethers';
import contractAddress from '../contracts/contract-address.json';
import ProductRegistryArtifact from '../contracts/ProductRegistry.json';

const ProductList = ({ isConnected, account }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [buying, setBuying] = useState(false);
  const [buyMessage, setBuyMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  useEffect(() => {
    if (isConnected) {
      loadProducts();
    }
  }, [isConnected]);

  const loadProducts = async () => {
    setLoading(true);
    setProducts([]);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress.ProductRegistry,
        ProductRegistryArtifact.abi,
        provider
      );
      console.log('[DEBUG] Đang gọi getAllProductIds...');
      const productIds = await contract.getAllProductIds();
      console.log('[DEBUG] productIds:', productIds);
      const productList = [];
      for (let i = 0; i < productIds.length; i++) {
        const id = productIds[i];
        try {
          console.log(`[DEBUG] Đang gọi getProduct cho id: ${id}`);
          const prod = await contract.getProduct(id);
          console.log(`[DEBUG] product data for ${id}:`, prod);
          productList.push({
            productId: id,
            name: prod[0],
            description: prod[1],
            location: prod[2],
            harvestDate: new Date(Number(prod[3]) * 1000),
            farmer: prod[4],
            certification: prod[5],
            isVerified: prod[6],
            timestamp: new Date(Number(prod[7]) * 1000),
            registeredBy: prod[8],
            price: ethers.utils.formatEther(prod[9]),
            owner: prod[10]
          });
        } catch (err) {
          console.error(`[DEBUG] Lỗi khi gọi getProduct cho id: ${id}`, err);
        }
      }
      setProducts(productList);
    } catch (error) {
      console.error('[DEBUG] Lỗi khi loadProducts:', error);
      setProducts([]);
    }
    setLoading(false);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.farmer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'verified' && product.isVerified) ||
                         (filterStatus === 'unverified' && !product.isVerified);
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('vi-VN');
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleBuyProduct = async (product) => {
    setBuying(true);
    setBuyMessage('');
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      // Địa chỉ và ABI contract thực tế
      const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
      const contractABI = [
        "function buyProduct(string _productId) public payable",
      ];
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.buyProduct(product.productId, {
        value: ethers.utils.parseEther(product.price)
      });
      await tx.wait();
      setBuyMessage('Mua sản phẩm thành công!');
      setToastMessage('Mua sản phẩm thành công!');
      setToastType('success');
    } catch (error) {
      const msg = 'Lỗi khi mua sản phẩm: ' + (error?.reason || error?.message || '');
      setBuyMessage(msg);
      setToastMessage(msg);
      setToastType('danger');
    } finally {
      setBuying(false);
    }
  };

  // Hiệu ứng tự động ẩn toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage('');
        setToastType('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Sau khi mua thành công, reload danh sách
  useEffect(() => {
    if (toastType === 'success' && toastMessage.includes('Mua sản phẩm')) {
      loadProducts();
    }
  }, [toastMessage, toastType]);

  if (!isConnected) {
    return (
      <div className="card">
        <div className="text-center">
          <Shield size={48} className="text-blue" />
          <h2>Kết nối ví để xem sản phẩm</h2>
          <p>Vui lòng kết nối MetaMask để xem danh sách sản phẩm.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-list">
      {/* Toast notification */}
      {toastMessage && (
        <div className={`toast-notification toast-${toastType}`} style={{position: 'fixed', top: 24, right: 24, zIndex: 2000, minWidth: 260}}>
          {toastMessage}
        </div>
      )}
      <div className="page-header">
        <h1>Danh sách sản phẩm</h1>
        <p>Quản lý và theo dõi tất cả sản phẩm nông sản đã đăng ký</p>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="search-filter">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="filter-box">
            <Filter size={20} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-input"
            >
              <option value="all">Tất cả</option>
              <option value="verified">Đã xác thực</option>
              <option value="unverified">Chưa xác thực</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="card">
          <div className="text-center">
            <div className="loading"></div>
            <p>Đang tải sản phẩm...</p>
          </div>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product, index) => (
            <div key={index} className="product-card">
              <div className="product-header">
                <div className="product-id">{product.productId}</div>
                <div className={`badge ${product.isVerified ? 'badge-success' : 'badge-warning'}`}>
                  {product.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                </div>
              </div>
              
              <div className="product-content">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                
                <div className="product-details">
                  <div className="detail-item">
                    <MapPin size={16} />
                    <span>{product.location}</span>
                  </div>
                  <div className="detail-item">
                    <User size={16} />
                    <span>{product.farmer}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>{formatDate(product.harvestDate)}</span>
                  </div>
                </div>

                {product.certification && (
                  <div className="certification">
                    <Shield size={16} />
                    <span>{product.certification}</span>
                  </div>
                )}
              </div>

              <div className="product-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => handleViewProduct(product)}
                >
                  <Eye size={16} />
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredProducts.length === 0 && !loading && (
        <div className="card">
          <div className="text-center">
            <Package size={48} className="text-blue" />
            <h3>Không tìm thấy sản phẩm</h3>
            <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết sản phẩm</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="product-detail">
                <div className="detail-row">
                  <label>Mã sản phẩm:</label>
                  <span>{selectedProduct.productId}</span>
                </div>
                <div className="detail-row">
                  <label>Tên sản phẩm:</label>
                  <span>{selectedProduct.name}</span>
                </div>
                <div className="detail-row">
                  <label>Mô tả:</label>
                  <span>{selectedProduct.description}</span>
                </div>
                <div className="detail-row">
                  <label>Địa điểm:</label>
                  <span>{selectedProduct.location}</span>
                </div>
                <div className="detail-row">
                  <label>Nông dân:</label>
                  <span>{selectedProduct.farmer}</span>
                </div>
                <div className="detail-row">
                  <label>Ngày thu hoạch:</label>
                  <span>{formatDate(selectedProduct.harvestDate)}</span>
                </div>
                <div className="detail-row">
                  <label>Chứng nhận:</label>
                  <span>{selectedProduct.certification || 'Không có'}</span>
                </div>
                <div className="detail-row">
                  <label>Giá:</label>
                  <span>{selectedProduct.price} ETH</span>
                </div>
                <div className="detail-row">
                  <label>Chủ sở hữu:</label>
                  <span>{formatAddress(selectedProduct.owner)}</span>
                </div>
                <div className="detail-row">
                  <label>Trạng thái:</label>
                  <span className={`badge ${selectedProduct.isVerified ? 'badge-success' : 'badge-warning'}`}>
                    {selectedProduct.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                  </span>
                </div>
                <div className="detail-row">
                  <label>Người đăng ký:</label>
                  <span>{formatAddress(selectedProduct.registeredBy)}</span>
                </div>
                <div className="detail-row">
                  <label>Ngày đăng ký:</label>
                  <span>{formatDate(selectedProduct.timestamp)}</span>
                </div>
              </div>
              {/* Nút mua sản phẩm */}
              {account && selectedProduct.owner && account.toLowerCase() !== selectedProduct.owner.toLowerCase() && (
                <div className="form-actions" style={{marginTop: 24}}>
                  <button className="btn btn-success" onClick={() => handleBuyProduct(selectedProduct)} disabled={buying}>
                    {buying ? 'Đang mua...' : `Mua sản phẩm (${selectedProduct.price} ETH)`}
                  </button>
                </div>
              )}
              {buyMessage && (
                <div className={`alert ${buyMessage.includes('thành công') ? 'alert-success' : 'alert-danger'}`} style={{marginTop: 16}}>
                  {buyMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList; 