# GreenZone - Nền tảng Blockchain cho Nông sản

GreenZone là một ứng dụng web sử dụng công nghệ blockchain để quản lý và theo dõi chuỗi cung ứng nông sản. Ứng dụng cho phép đăng ký sản phẩm, theo dõi quá trình sản xuất và xác thực nguồn gốc thông qua smart contract.

## 🚀 Tính năng chính

### 1. Đăng ký sản phẩm nông sản
- Đăng ký thông tin sản phẩm lên blockchain
- Tạo mã sản phẩm duy nhất
- Lưu trữ thông tin nông dân, địa điểm, ngày thu hoạch
- Chứng nhận chất lượng

### 2. Quản lý sản phẩm
- Xem danh sách tất cả sản phẩm đã đăng ký
- Tìm kiếm và lọc sản phẩm
- Xem chi tiết thông tin sản phẩm
- Trạng thái xác thực

### 3. Theo dõi chuỗi cung ứng
- Timeline chi tiết từ sản xuất đến tiêu thụ
- Theo dõi từng bước trong quá trình
- Thông tin về địa điểm, thời gian, người thực hiện

### 4. Kết nối MetaMask
- Kết nối ví MetaMask để tương tác với smart contract
- Xác thực người dùng
- Thực hiện giao dịch blockchain

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18** - Framework JavaScript
- **React Router** - Điều hướng
- **Ethers.js** - Tương tác với Ethereum
- **Lucide React** - Icons
- **CSS3** - Styling

### Blockchain
- **Solidity** - Ngôn ngữ smart contract
- **Hardhat** - Development framework
- **Ethereum** - Blockchain platform

### Smart Contract
- **ProductRegistry** - Quản lý sản phẩm và chuỗi cung ứng
- **Events** - Theo dõi thay đổi
- **Access Control** - Phân quyền người dùng

## 📦 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js (v16 trở lên)
- npm hoặc yarn
- MetaMask extension

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd GreenZone-Loc
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Compile smart contract
```bash
npm run compile
```

### Bước 4: Deploy smart contract (tùy chọn)
```bash
# Chạy local blockchain
npx hardhat node

# Deploy contract (trong terminal khác)
npm run deploy
```

### Bước 5: Chạy ứng dụng
```bash
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## 🔧 Cấu hình

### Smart Contract Address
Sau khi deploy, cập nhật địa chỉ contract trong các file:
- `src/components/ProductRegistration.js`
- `src/components/ProductList.js`

### MetaMask
1. Cài đặt MetaMask extension
2. Tạo ví hoặc import ví hiện có
3. Kết nối với mạng Ethereum (mainnet/testnet/localhost)

## 📱 Hướng dẫn sử dụng

### 1. Kết nối ví
- Click "Kết nối MetaMask" trên header
- Xác nhận kết nối trong MetaMask
- Địa chỉ ví sẽ hiển thị khi kết nối thành công

### 2. Đăng ký sản phẩm
- Vào trang "Đăng ký"
- Điền thông tin sản phẩm
- Click "Tạo mã" để tạo mã sản phẩm tự động
- Click "Đăng ký sản phẩm"
- Xác nhận giao dịch trong MetaMask

### 3. Xem danh sách sản phẩm
- Vào trang "Sản phẩm"
- Sử dụng tìm kiếm và bộ lọc
- Click "Xem chi tiết" để xem thông tin đầy đủ

### 4. Theo dõi chuỗi cung ứng
- Vào trang "Chuỗi cung ứng"
- Chọn sản phẩm từ dropdown
- Xem timeline chi tiết

## 🏗️ Cấu trúc dự án

```
GreenZone-Loc/
├── contracts/
│   └── ProductRegistry.sol
├── scripts/
│   └── deploy.js
├── src/
│   ├── components/
│   │   ├── MetaMaskConnect.js
│   │   ├── Dashboard.js
│   │   ├── ProductRegistration.js
│   │   ├── ProductList.js
│   │   └── SupplyChain.js
│   ├── App.js
│   ├── App.css
│   ├── components.css
│   └── index.js
├── public/
│   └── index.html
├── hardhat.config.js
├── package.json
└── README.md
```

## 🔒 Bảo mật

- Smart contract sử dụng modifiers để kiểm soát quyền truy cập
- Thông tin được lưu trữ trên blockchain - không thể thay đổi
- Xác thực người dùng thông qua MetaMask
- Mã hóa dữ liệu nhạy cảm

## 🚀 Triển khai

### Testnet
1. Cấu hình mạng testnet trong `hardhat.config.js`
2. Deploy contract lên testnet
3. Cập nhật địa chỉ contract
4. Build và deploy frontend

### Mainnet
1. Audit smart contract
2. Deploy lên mainnet
3. Cập nhật địa chỉ contract
4. Deploy frontend

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết

## 📞 Liên hệ

- Email: info@greenzone.vn
- Website: https://greenzone.vn
- GitHub: https://github.com/greenzone-loc

## 🙏 Cảm ơn

Cảm ơn bạn đã quan tâm đến dự án GreenZone! Chúng tôi hy vọng ứng dụng này sẽ góp phần thúc đẩy tính minh bạch và an toàn trong chuỗi cung ứng nông sản. 