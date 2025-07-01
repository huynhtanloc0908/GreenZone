import React, { useState, useEffect } from 'react';
import { Wallet, Copy, Check } from 'lucide-react';
import detectEthereumProvider from '@metamask/detect-provider';

const MetaMaskConnect = ({ isConnected, setIsConnected, account, setAccount }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      const accounts = await provider.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    }
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      const provider = await detectEthereumProvider();
      
      if (!provider) {
        alert('Vui lòng cài đặt MetaMask!');
        return;
      }

      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Lỗi kết nối MetaMask:', error);
      alert('Không thể kết nối MetaMask. Vui lòng thử lại!');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setIsConnected(false);
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Lỗi copy địa chỉ:', error);
    }
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected) {
    return (
      <div className="wallet-connected">
        <div className="wallet-info">
          <Wallet size={16} className="wallet-icon" />
          <span className="wallet-address">{formatAddress(account)}</span>
          <button 
            className="copy-btn" 
            onClick={copyAddress}
            title="Copy địa chỉ"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
        <button 
          className="btn btn-secondary disconnect-btn" 
          onClick={disconnectWallet}
        >
          Ngắt kết nối
        </button>
      </div>
    );
  }

  return (
    <button 
      className="btn btn-primary connect-btn" 
      onClick={connectWallet}
      disabled={isConnecting}
    >
      {isConnecting ? (
        <>
          <div className="loading"></div>
          Đang kết nối...
        </>
      ) : (
        <>
          <Wallet size={16} />
          Kết nối MetaMask
        </>
      )}
    </button>
  );
};

export default MetaMaskConnect; 