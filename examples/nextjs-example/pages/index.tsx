import { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { useFhevm } from 'fhevm-sdk/react';
import Head from 'next/head';

export default function Home() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [account, setAccount] = useState<string>('');
  const [valueToEncrypt, setValueToEncrypt] = useState<string>('42');
  const [encryptedResult, setEncryptedResult] = useState<string>('');

  const {
    client,
    isInitialized,
    isInitializing,
    initialize,
    encryptUint32,
    error
  } = useFhevm(provider, 'localhost');

  useEffect(() => {
    checkWalletConnection();
  }, []);

  useEffect(() => {
    if (provider && !isInitialized && !isInitializing) {
      initialize();
    }
  }, [provider, isInitialized, isInitializing, initialize]);

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          connectWallet();
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Provider = new BrowserProvider(window.ethereum);
        const signer = await web3Provider.getSigner();
        const address = await signer.getAddress();

        setProvider(web3Provider);
        setAccount(address);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        alert('Failed to connect wallet');
      }
    } else {
      alert('Please install MetaMask');
    }
  };

  const handleEncrypt = async () => {
    if (!isInitialized) {
      alert('FHEVM client not initialized yet. Please wait...');
      return;
    }

    try {
      const value = parseInt(valueToEncrypt);
      const encrypted = await encryptUint32(value);

      if (encrypted) {
        // Convert Uint8Array to hex string for display
        const hexString = Array.from(encrypted)
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        setEncryptedResult('0x' + hexString);
      }
    } catch (err) {
      console.error('Encryption failed:', err);
      alert('Encryption failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  return (
    <>
      <Head>
        <title>Next.js FHEVM SDK Example</title>
        <meta name="description" content="Example Next.js app using FHEVM SDK" />
      </Head>

      <div className="container">
        <header className="header">
          <h1>🔐 Next.js FHEVM SDK Example</h1>
          <p>Confidential Computing with Fully Homomorphic Encryption</p>
        </header>

        <div className="wallet-section">
          {!account ? (
            <button className="connect-btn" onClick={connectWallet}>
              Connect MetaMask
            </button>
          ) : (
            <div className="account-info">
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          )}
        </div>

        <div className="status-section">
          <h2>SDK Status</h2>
          <div className="status-grid">
            <div className="status-item">
              <span className="label">Provider:</span>
              <span className={provider ? 'status-ok' : 'status-error'}>
                {provider ? '✅ Connected' : '❌ Not Connected'}
              </span>
            </div>
            <div className="status-item">
              <span className="label">FHEVM Client:</span>
              <span className={isInitialized ? 'status-ok' : isInitializing ? 'status-pending' : 'status-error'}>
                {isInitialized ? '✅ Ready' : isInitializing ? '⏳ Initializing...' : '❌ Not Initialized'}
              </span>
            </div>
            {error && (
              <div className="status-item error">
                <span className="label">Error:</span>
                <span>{error.message}</span>
              </div>
            )}
          </div>
        </div>

        <div className="demo-section">
          <h2>Encryption Demo</h2>
          <p>Encrypt a uint32 value using FHE</p>

          <div className="input-group">
            <label htmlFor="value">Value to Encrypt:</label>
            <input
              id="value"
              type="number"
              value={valueToEncrypt}
              onChange={(e) => setValueToEncrypt(e.target.value)}
              placeholder="Enter a number"
            />
          </div>

          <button
            className="encrypt-btn"
            onClick={handleEncrypt}
            disabled={!isInitialized}
          >
            🔒 Encrypt Value
          </button>

          {encryptedResult && (
            <div className="result-box">
              <h3>Encrypted Result:</h3>
              <code className="encrypted-value">{encryptedResult}</code>
              <p className="result-info">
                This encrypted value can be used in smart contract transactions while keeping the actual value private.
              </p>
            </div>
          )}
        </div>

        <div className="info-section">
          <h2>About This Example</h2>
          <ul>
            <li>✨ Built with Next.js 14 and React 18</li>
            <li>🔐 Integrated with FHEVM SDK for confidential computing</li>
            <li>⚡ Uses React hooks for easy state management</li>
            <li>🎨 Clean and responsive UI</li>
            <li>🔗 MetaMask wallet integration</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
          padding: 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          color: white;
        }

        .header h1 {
          margin: 0 0 10px 0;
          font-size: 2.5rem;
        }

        .header p {
          margin: 0;
          opacity: 0.9;
          font-size: 1.1rem;
        }

        .wallet-section {
          text-align: center;
          margin-bottom: 30px;
        }

        .connect-btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .connect-btn:hover {
          background: #5568d3;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .account-info {
          background: #f0f4ff;
          border: 2px solid #667eea;
          padding: 12px 24px;
          border-radius: 8px;
          display: inline-block;
          font-weight: 600;
          color: #667eea;
        }

        .status-section, .demo-section, .info-section {
          background: white;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .status-section h2, .demo-section h2, .info-section h2 {
          margin-top: 0;
          color: #333;
          border-bottom: 3px solid #667eea;
          padding-bottom: 10px;
        }

        .status-grid {
          display: grid;
          gap: 15px;
          margin-top: 20px;
        }

        .status-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .status-item.error {
          background: #fee;
          color: #c33;
        }

        .label {
          font-weight: 600;
          color: #555;
        }

        .status-ok {
          color: #22c55e;
          font-weight: 600;
        }

        .status-pending {
          color: #f59e0b;
          font-weight: 600;
        }

        .status-error {
          color: #ef4444;
          font-weight: 600;
        }

        .input-group {
          margin: 20px 0;
        }

        .input-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #555;
        }

        .input-group input {
          width: 100%;
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        .input-group input:focus {
          outline: none;
          border-color: #667eea;
        }

        .encrypt-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 15px 40px;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }

        .encrypt-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .encrypt-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .result-box {
          margin-top: 30px;
          padding: 20px;
          background: #f0f4ff;
          border-left: 4px solid #667eea;
          border-radius: 8px;
        }

        .result-box h3 {
          margin-top: 0;
          color: #667eea;
        }

        .encrypted-value {
          display: block;
          padding: 15px;
          background: #1e293b;
          color: #22c55e;
          border-radius: 6px;
          font-family: 'Courier New', monospace;
          word-break: break-all;
          font-size: 0.9rem;
          margin: 15px 0;
        }

        .result-info {
          color: #666;
          font-size: 0.9rem;
          font-style: italic;
          margin: 10px 0 0 0;
        }

        .info-section ul {
          list-style: none;
          padding: 0;
        }

        .info-section li {
          padding: 10px 0;
          border-bottom: 1px solid #e5e7eb;
          font-size: 1.05rem;
        }

        .info-section li:last-child {
          border-bottom: none;
        }

        @media (max-width: 768px) {
          .header h1 {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </>
  );
}
