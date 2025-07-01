// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract ProductRegistry {
    struct Product {
        string productId;
        string name;
        string description;
        string location;
        uint256 harvestDate;
        string farmer;
        string certification;
        bool isVerified;
        uint256 timestamp;
        address registeredBy;
        uint256 price;
        address owner;
    }
    
    struct SupplyChainStep {
        string stepId;
        string productId;
        string action;
        string location;
        uint256 timestamp;
        address actor;
        string details;
    }
    
    mapping(string => Product) public products;
    mapping(string => SupplyChainStep[]) public supplyChain;
    mapping(address => bool) public authorizedUsers;
    mapping(string => bool) public productExists;
    string[] public allProductIds;
    
    address public owner;
    uint256 public productCount;
    
    event ProductRegistered(string productId, string name, address farmer);
    event SupplyChainUpdated(string productId, string action, address actor);
    event ProductVerified(string productId, bool verified);
    event UserAuthorized(address user, bool authorized);
    event ProductPurchased(string productId, address buyer, uint256 price);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    modifier onlyAuthorized() {
        require(authorizedUsers[msg.sender] || msg.sender == owner, "Not authorized");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        authorizedUsers[msg.sender] = true;
    }
    
    function registerProduct(
        string memory _productId,
        string memory _name,
        string memory _description,
        string memory _location,
        uint256 _harvestDate,
        string memory _farmer,
        string memory _certification,
        uint256 _price
    ) public {
        require(!productExists[_productId], "Product already exists");
        require(_price > 0, "Price must be greater than 0");
        
        products[_productId] = Product({
            productId: _productId,
            name: _name,
            description: _description,
            location: _location,
            harvestDate: _harvestDate,
            farmer: _farmer,
            certification: _certification,
            isVerified: false,
            timestamp: block.timestamp,
            registeredBy: msg.sender,
            price: _price,
            owner: msg.sender
        });
        
        productExists[_productId] = true;
        productCount++;
        allProductIds.push(_productId);
        
        // Add initial supply chain step
        addSupplyChainStep(_productId, "REGISTRATION", _location, "Product registered in blockchain");
        
        emit ProductRegistered(_productId, _name, msg.sender);
    }
    
    function addSupplyChainStep(
        string memory _productId,
        string memory _action,
        string memory _location,
        string memory _details
    ) public onlyAuthorized {
        require(productExists[_productId], "Product does not exist");
        
        string memory stepId = string(abi.encodePacked(_productId, "-", uint2str(supplyChain[_productId].length)));
        
        supplyChain[_productId].push(SupplyChainStep({
            stepId: stepId,
            productId: _productId,
            action: _action,
            location: _location,
            timestamp: block.timestamp,
            actor: msg.sender,
            details: _details
        }));
        
        emit SupplyChainUpdated(_productId, _action, msg.sender);
    }
    
    function verifyProduct(string memory _productId, bool _verified) public onlyOwner {
        require(productExists[_productId], "Product does not exist");
        products[_productId].isVerified = _verified;
        emit ProductVerified(_productId, _verified);
    }
    
    function updateProduct(
        string memory _productId,
        string memory _name,
        string memory _description,
        string memory _location,
        string memory _certification
    ) public onlyAuthorized {
        require(productExists[_productId], "Product does not exist");
        require(msg.sender == products[_productId].registeredBy || msg.sender == owner, "Not authorized to update");
        
        products[_productId].name = _name;
        products[_productId].description = _description;
        products[_productId].location = _location;
        products[_productId].certification = _certification;
    }
    
    function authorizeUser(address _user, bool _authorized) public onlyOwner {
        authorizedUsers[_user] = _authorized;
        emit UserAuthorized(_user, _authorized);
    }
    
    function getProduct(string memory _productId) public view returns (
        string memory name,
        string memory description,
        string memory location,
        uint256 harvestDate,
        string memory farmer,
        string memory certification,
        bool isVerified,
        uint256 timestamp,
        address registeredBy,
        uint256 price,
        address owner
    ) {
        require(productExists[_productId], "Product does not exist");
        Product memory product = products[_productId];
        return (
            product.name,
            product.description,
            product.location,
            product.harvestDate,
            product.farmer,
            product.certification,
            product.isVerified,
            product.timestamp,
            product.registeredBy,
            product.price,
            product.owner
        );
    }
    
    function getSupplyChainLength(string memory _productId) public view returns (uint256) {
        return supplyChain[_productId].length;
    }
    
    function getSupplyChainStep(string memory _productId, uint256 _index) public view returns (
        string memory stepId,
        string memory action,
        string memory location,
        uint256 timestamp,
        address actor,
        string memory details
    ) {
        require(_index < supplyChain[_productId].length, "Step does not exist");
        SupplyChainStep memory step = supplyChain[_productId][_index];
        return (
            step.stepId,
            step.action,
            step.location,
            step.timestamp,
            step.actor,
            step.details
        );
    }
    
    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        while (_i != 0) {
            k -= 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
    
    function buyProduct(string memory _productId) public payable {
        require(productExists[_productId], "Product does not exist");
        Product storage product = products[_productId];
        require(msg.sender != product.owner, "Owner cannot buy their own product");
        require(msg.value >= product.price, "Not enough ETH sent");
        address previousOwner = product.owner;
        uint256 price = product.price;
        product.owner = msg.sender;
        payable(previousOwner).transfer(price);
        addSupplyChainStep(_productId, "PURCHASED", product.location, "Product purchased by new owner");
        emit ProductPurchased(_productId, msg.sender, price);
    }
    
    function getAllProductIds() public view returns (string[] memory) {
        return allProductIds;
    }
} 