import React, { useState } from 'react';
import { Leaf, Calendar, MapPin, User, FileText, Save } from 'lucide-react';
import { ethers } from 'ethers';
import contractAddress from '../contracts/contract-address.json';
import ProductRegistryArtifact from '../contracts/ProductRegistry.json';

const ProductRegistration = ({ isConnected, account, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    description: '',
    location: '',
    harvestDate: '',
    farmer: '',
    certification: '',
    price: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateProductId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 5);
    return `PROD-${timestamp}-${random}`.toUpperCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      setMessage('Vui lòng kết nối MetaMask trước!');
      return;
    }

    if (!formData.productId || !formData.name || !formData.location || !formData.farmer || !formData.price) {
      setMessage('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    if (isNaN(formData.price) || Number(formData.price) <= 0) {
      setMessage('Giá sản phẩm phải lớn hơn 0!');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Tạo provider và signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Import contract ABI và address
      const contract = new ethers.Contract(
        contractAddress.ProductRegistry,
        ProductRegistryArtifact.abi,
        signer
      );

      // Convert harvest date to timestamp
      const harvestTimestamp = formData.harvestDate ? new Date(formData.harvestDate).getTime() / 1000 : 0;
      // Convert price (ETH) to wei
      const priceWei = ethers.utils.parseEther(formData.price);

      // Gọi smart contract
      const tx = await contract.registerProduct(
        formData.productId,
        formData.name,
        formData.description,
        formData.location,
        harvestTimestamp,
        formData.farmer,
        formData.certification,
        priceWei
      );

      await tx.wait();

      setMessage('Đăng ký sản phẩm thành công!');
      setFormData({
        productId: '',
        name: '',
        description: '',
        location: '',
        harvestDate: '',
        farmer: '',
        certification: '',
        price: ''
      });
      // Gọi callback reload danh sách sản phẩm nếu có
      if (onRegisterSuccess) onRegisterSuccess();

    } catch (error) {
      console.error('Lỗi đăng ký sản phẩm:', error);
      setMessage('Có lỗi xảy ra khi đăng ký sản phẩm. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateId = () => {
    setFormData(prev => ({
      ...prev,
      productId: generateProductId()
    }));
  };

  // Hàm thêm sản phẩm mẫu
  const handleAddSampleProducts = async () => {
    if (!isConnected) {
      setMessage('Vui lòng kết nối MetaMask trước!');
      return;
    }
    setIsLoading(true);
    setMessage('Đang thêm sản phẩm mẫu...');
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress.ProductRegistry,
        ProductRegistryArtifact.abi,
        signer
      );
      const samples = [
        {
          productId: generateProductId(),
          name: 'Gạo ST25',
          description: 'Gạo thơm ngon nhất thế giới',
          location: 'Sóc Trăng',
          harvestDate: Math.floor(Date.now() / 1000),
          farmer: 'Nguyễn Văn A',
          certification: 'VietGAP',
          price: ethers.utils.parseEther('0.01')
        },
        {
          productId: generateProductId(),
          name: 'Xoài Cát Hòa Lộc',
          description: 'Xoài ngọt, thơm, nổi tiếng miền Tây',
          location: 'Tiền Giang',
          harvestDate: Math.floor(Date.now() / 1000),
          farmer: 'Trần Thị B',
          certification: 'GlobalGAP',
          price: ethers.utils.parseEther('0.02')
        },
        {
          productId: generateProductId(),
          name: 'Thanh Long Ruột Đỏ',
          description: 'Thanh long ruột đỏ xuất khẩu',
          location: 'Bình Thuận',
          harvestDate: Math.floor(Date.now() / 1000),
          farmer: 'Lê Văn C',
          certification: 'VietGAP',
          price: ethers.utils.parseEther('0.015')
        }
      ];
      for (const sample of samples) {
        const tx = await contract.registerProduct(
          sample.productId,
          sample.name,
          sample.description,
          sample.location,
          sample.harvestDate,
          sample.farmer,
          sample.certification,
          sample.price
        );
        await tx.wait();
      }
      setMessage('Đã thêm sản phẩm mẫu thành công!');
      if (onRegisterSuccess) onRegisterSuccess();
    } catch (error) {
      setMessage('Có lỗi khi thêm sản phẩm mẫu: ' + (error?.reason || error?.message || ''));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="card">
        <div className="text-center">
          <Leaf size={48} className="text-green" />
          <h2>Kết nối ví để đăng ký sản phẩm</h2>
          <p>Vui lòng kết nối MetaMask để sử dụng tính năng đăng ký sản phẩm.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-registration">
      <div className="page-header">
        <h1>Đăng ký sản phẩm nông sản</h1>
        <p>Đăng ký thông tin sản phẩm nông sản lên blockchain</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">
                <FileText size={16} />
                Mã sản phẩm *
              </label>
              <div className="input-group">
                <input
                  type="text"
                  name="productId"
                  value={formData.productId}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Nhập mã sản phẩm"
                  required
                />
                <button
                  type="button"
                  onClick={handleGenerateId}
                  className="btn btn-secondary"
                >
                  Tạo mã
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Leaf size={16} />
                Tên sản phẩm *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ví dụ: Gạo Jasmine"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <FileText size={16} />
              Mô tả sản phẩm
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-input form-textarea"
              placeholder="Mô tả chi tiết về sản phẩm..."
              rows="4"
            />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">
                <MapPin size={16} />
                Địa điểm sản xuất *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ví dụ: Đồng Tháp, Việt Nam"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar size={16} />
                Ngày thu hoạch
              </label>
              <input
                type="date"
                name="harvestDate"
                value={formData.harvestDate}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">
                <User size={16} />
                Tên nông dân *
              </label>
              <input
                type="text"
                name="farmer"
                value={formData.farmer}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Tên người sản xuất"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <FileText size={16} />
                Chứng nhận
              </label>
              <input
                type="text"
                name="certification"
                value={formData.certification}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ví dụ: VietGAP, GlobalGAP"
              />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">
                <FileText size={16} />
                Giá sản phẩm (ETH) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ví dụ: 0.05"
                min="0"
                step="0.0001"
                required
              />
            </div>
          </div>

          {message && (
            <div className={`alert ${message.includes('thành công') ? 'alert-success' : 'alert-danger'}`}>
              {message}
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-success"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="loading"></div>
                  Đang đăng ký...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Đăng ký sản phẩm
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div style={{ marginBottom: 16 }}>
        <button type="button" className="btn btn-secondary" onClick={handleAddSampleProducts} disabled={isLoading}>
          Thêm sản phẩm mẫu để test
        </button>
      </div>

      <div className="card">
        <h3>Hướng dẫn đăng ký</h3>
        <div className="guide-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Điền thông tin sản phẩm</h4>
              <p>Nhập đầy đủ thông tin về sản phẩm nông sản cần đăng ký</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Xác nhận giao dịch</h4>
              <p>Xác nhận giao dịch trên MetaMask để lưu thông tin lên blockchain</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Hoàn thành đăng ký</h4>
              <p>Thông tin sản phẩm đã được lưu trữ an toàn trên blockchain</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductRegistration; 