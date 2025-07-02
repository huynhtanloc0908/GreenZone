const hre = require("hardhat");

async function main() {
  // Địa chỉ contract mới nhất sau khi deploy
  const contractAddress = require("../src/contracts/contract-address.json").ProductRegistry;
  const ProductRegistry = await hre.ethers.getContractAt("ProductRegistry", contractAddress);

  const samples = [
    {
      productId: "SAMPLE-1",
      name: "Gạo ST25",
      description: "Gạo thơm ngon nhất thế giới",
      location: "Sóc Trăng",
      harvestDate: Math.floor(Date.now() / 1000),
      farmer: "Nguyễn Văn A",
      certification: "VietGAP",
      price: hre.ethers.utils.parseEther("0.01")
    },
    {
      productId: "SAMPLE-2",
      name: "Xoài Cát Hòa Lộc",
      description: "Xoài ngọt, thơm, nổi tiếng miền Tây",
      location: "Tiền Giang",
      harvestDate: Math.floor(Date.now() / 1000),
      farmer: "Trần Thị B",
      certification: "GlobalGAP",
      price: hre.ethers.utils.parseEther("0.02")
    },
    {
      productId: "SAMPLE-3",
      name: "Thanh Long Ruột Đỏ",
      description: "Thanh long ruột đỏ xuất khẩu",
      location: "Bình Thuận",
      harvestDate: Math.floor(Date.now() / 1000),
      farmer: "Lê Văn C",
      certification: "VietGAP",
      price: hre.ethers.utils.parseEther("0.015")
    }
  ];

  for (const sample of samples) {
    const tx = await ProductRegistry.registerProduct(
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
    console.log(`Đã thêm sản phẩm mẫu: ${sample.name}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 