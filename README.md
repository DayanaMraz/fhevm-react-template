# FHEVM SDK - Universal SDK for Confidential Smart Contracts

> **Competition Submission**: A framework-agnostic SDK for building privacy-preserving dApps with Fully Homomorphic Encryption (FHE)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Framework Agnostic](https://img.shields.io/badge/Framework-Agnostic-green.svg)]()

## 🎯 Overview

This project provides a **universal FHEVM SDK** that makes building confidential frontends simple, consistent, and developer-friendly. Built with a wagmi-like structure familiar to web3 developers, it wraps all necessary FHEVM packages and provides adapters for React, Vue, and vanilla JavaScript.

### Key Features

✨ **Framework Agnostic** - Works with Next.js, React, Vue, or plain Node.js
🎣 **Hooks & Composables** - React hooks and Vue composables for easy integration
📦 **All-in-One Package** - No need to manage scattered dependencies
🔐 **Full FHEVM Support** - Complete encryption, decryption, and contract interaction
⚡ **Quick Setup** - Get started with less than 10 lines of code
🛠️ **TypeScript First** - Full type safety and IntelliSense support
🔧 **Modular Architecture** - Use only what you need

**🌐 Website**: [https://digital-court-fhe.vercel.app/](https://digital-court-fhe.vercel.app/)

## 🔗 Smart Contract Details

**Contract Address**: `0x6af32dc352959fDf6C19C8Cf4f128dcCe0086b51`

**Network**: Sepolia Testnet

**Blockchain Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0x6af32dc352959fDf6C19C8Cf4f128dcCe0086b51)
---

## 🚀 Quick Start (< 10 lines of code)

### Installation

```bash
npm install
```

### React/Next.js Example

```tsx
import { useFhevm } from 'fhevm-sdk/react';
import { BrowserProvider } from 'ethers';

function App() {
  const provider = new BrowserProvider(window.ethereum);
  const { initialize, encryptUint32 } = useFhevm(provider, 'sepolia');

  useEffect(() => { initialize(); }, []);

  const encrypted = await encryptUint32(42);
  // Use encrypted value in transaction
}
```

That's it! You're ready to build confidential dApps.

---

## 📦 Project Structure

```
fhevm-template-monorepo/
├── packages/
│   └── fhevm-sdk/              # Core SDK package
│       ├── src/
│       │   ├── core/           # Framework-agnostic core
│       │   │   ├── FhevmClient.ts       # Main FHEVM client
│       │   │   └── ContractClient.ts    # Contract interaction
│       │   ├── react/          # React hooks
│       │   │   ├── useFhevm.ts
│       │   │   └── useContract.ts
│       │   └── vue/            # Vue composables
│       │       └── useFhevm.ts
│       ├── contracts/          # Example contracts
│       │   ├── TFHE.sol
│       │   ├── FHELib.sol
│       │   └── ConfidentialERC20.sol
│       └── package.json
│
├── examples/
│   ├── nextjs-example/         # Next.js 14 integration
│   ├── react-example/          # React with Vite
│   ├── vue-example/            # Vue 3 integration
│   └── digital-court-example/  # Real-world example (imported dApp)
│
└── package.json
```

---

## 📚 SDK Architecture

### Core Layer (`fhevm-sdk/core`)

The foundation provides framework-agnostic functionality:

#### `FhevmClient` - Main encryption/decryption client

```typescript
import { FhevmClient } from 'fhevm-sdk';

const client = new FhevmClient({
  provider: ethersProvider,
  network: 'sepolia'
});

await client.initialize();

// Encrypt values
const encrypted8 = await client.encryptUint8(10);
const encrypted32 = await client.encryptUint32(1000);
const encryptedBool = await client.encryptBool(true);

// Decrypt values (requires EIP-712 signature)
const decrypted = await client.userDecrypt(ciphertext, contractAddress, signer);
```

#### `ContractClient` - Enhanced contract interaction

```typescript
import { ContractClient } from 'fhevm-sdk';

const contract = new ContractClient({
  address: '0x...',
  abi: contractABI,
  signer: signer,
  fhevmClient: client
});

// Write with encrypted inputs
await contract.writeWithEncryption(
  'transfer',
  { amount: 100 },  // Automatically encrypted
  recipientAddress
);

// Decrypt contract values
const balance = await contract.read('balanceOf', userAddress);
const decrypted = await contract.decryptValue(balance);
```

### React Layer (`fhevm-sdk/react`)

React hooks for seamless integration:

```typescript
import { useFhevm, useContract } from 'fhevm-sdk/react';

function MyComponent() {
  const {
    client,
    isInitialized,
    initialize,
    encryptUint32,
    decrypt
  } = useFhevm(provider, 'sepolia');

  const {
    contract,
    read,
    writeWithEncryption
  } = useContract(address, abi, signer, client);

  // Use in your component
}
```

### Vue Layer (`fhevm-sdk/vue`)

Vue 3 composables:

```vue
<script setup>
import { useFhevm } from 'fhevm-sdk/vue';

const { client, isInitialized, initialize, encryptUint32 } = useFhevm(
  provider,
  'sepolia'
);

onMounted(() => initialize());
</script>
```

---

## 💻 Complete Usage Examples

### 1. Next.js Integration

See `examples/nextjs-example/` for full implementation.

```tsx
// pages/index.tsx
import { useState, useEffect } from 'next';
import { BrowserProvider } from 'ethers';
import { useFhevm } from 'fhevm-sdk/react';

export default function Home() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const { client, initialize, encryptUint32 } = useFhevm(provider, 'localhost');

  useEffect(() => {
    const initWallet = async () => {
      const web3Provider = new BrowserProvider(window.ethereum);
      setProvider(web3Provider);
    };
    initWallet();
  }, []);

  useEffect(() => {
    if (provider) initialize();
  }, [provider]);

  const handleEncrypt = async () => {
    const encrypted = await encryptUint32(42);
    console.log('Encrypted:', encrypted);
  };

  return <button onClick={handleEncrypt}>Encrypt</button>;
}
```

### 2. React with Contract Interaction

```tsx
import { useContract } from 'fhevm-sdk/react';

function TokenTransfer() {
  const { writeWithEncryption } = useContract(
    contractAddress,
    contractABI,
    signer,
    fhevmClient
  );

  const transfer = async () => {
    await writeWithEncryption(
      'transfer',
      { amount: 100 },      // Encrypted automatically
      recipientAddress      // Regular argument
    );
  };

  return <button onClick={transfer}>Transfer Tokens</button>;
}
```

### 3. Vue 3 Example

```vue
<template>
  <div>
    <button @click="handleEncrypt">Encrypt Value</button>
    <p v-if="result">Encrypted: {{ result }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFhevm } from 'fhevm-sdk/vue';

const provider = ref(null);
const result = ref('');

const { initialize, encryptUint32 } = useFhevm(provider.value, 'sepolia');

onMounted(async () => {
  provider.value = new BrowserProvider(window.ethereum);
  await initialize();
});

const handleEncrypt = async () => {
  const encrypted = await encryptUint32(42);
  result.value = encrypted;
};
</script>
```

### 4. Vanilla JavaScript/Node.js

```javascript
import { FhevmClient } from 'fhevm-sdk';
import { JsonRpcProvider } from 'ethers';

const provider = new JsonRpcProvider('http://localhost:8545');

const client = new FhevmClient({
  provider,
  network: 'localhost'
});

await client.initialize();

const encrypted = await client.encryptUint32(1000);
console.log('Encrypted value:', encrypted);
```

---

## 🏗️ Building and Running

### Install All Dependencies

```bash
npm run install:all
```

### Build the SDK

```bash
npm run build:sdk
```

### Run Examples

```bash
# Next.js example
npm run dev:nextjs

# React example
npm run dev:react

# Vue example
npm run dev:vue

# Digital Court example (imported dApp)
npm run dev:digital-court
```

### Compile Smart Contracts

```bash
npm run compile:contracts
```

---

## 🎓 Example Projects

### 1. Next.js Example (`examples/nextjs-example`)

- Full Next.js 14 integration
- TypeScript support
- React hooks usage
- Wallet connection
- Encryption/decryption demo

**Run:** `npm run dev:nextjs`

### 2. Digital Court Example (`examples/digital-court-example`)

Real-world imported dApp demonstrating:
- Complex contract interactions
- Encrypted voting system
- Multi-user workflows
- Production-ready patterns

**Features:**
- Privacy-preserving jury voting
- Encrypted vote aggregation
- EIP-712 signature integration
- Complete case management

---

## 🔧 SDK API Reference

### Core Client Methods

#### `FhevmClient`

| Method | Description | Returns |
|--------|-------------|---------|
| `initialize()` | Initialize FHEVM instance | `Promise<void>` |
| `encryptUint8(value)` | Encrypt 8-bit unsigned integer | `Promise<Uint8Array>` |
| `encryptUint16(value)` | Encrypt 16-bit unsigned integer | `Promise<Uint8Array>` |
| `encryptUint32(value)` | Encrypt 32-bit unsigned integer | `Promise<Uint8Array>` |
| `encryptUint64(value)` | Encrypt 64-bit unsigned integer | `Promise<Uint8Array>` |
| `encryptBool(value)` | Encrypt boolean value | `Promise<Uint8Array>` |
| `userDecrypt(ciphertext, contract, signer)` | Decrypt with EIP-712 | `Promise<bigint>` |
| `publicDecrypt(ciphertext)` | Public decryption | `Promise<bigint>` |

#### `ContractClient`

| Method | Description | Returns |
|--------|-------------|---------|
| `read(fn, ...args)` | Call view function | `Promise<any>` |
| `write(fn, ...args)` | Execute transaction | `Promise<any>` |
| `writeWithEncryption(fn, encrypted, ...args)` | Execute with encrypted inputs | `Promise<any>` |
| `decryptValue(ciphertext)` | Decrypt contract value | `Promise<bigint>` |
| `on(event, listener)` | Listen to events | `void` |

### React Hooks

#### `useFhevm(provider, network)`

Returns:
- `client`: FhevmClient instance
- `isInitialized`: boolean
- `isInitializing`: boolean
- `error`: Error | null
- `initialize()`: Initialize function
- `encryptUint8/16/32/64`: Encryption functions
- `encryptBool`: Boolean encryption
- `decrypt`: Decryption function

#### `useContract(address, abi, signer, fhevmClient)`

Returns:
- `contract`: ContractClient instance
- `isReady`: boolean
- `error`: Error | null
- `read`: Read contract function
- `write`: Write contract function
- `writeWithEncryption`: Encrypted write function
- `decrypt`: Decrypt contract value

---

## 🎯 Design Principles

### 1. **Simplicity**
- Minimal setup code (< 10 lines)
- Intuitive API design
- Clear error messages

### 2. **Modularity**
- Use only what you need
- Framework-specific adapters
- Tree-shakeable exports

### 3. **Developer Experience**
- TypeScript-first
- IntelliSense support
- Familiar patterns (wagmi-like)

### 4. **Performance**
- Lazy initialization
- Efficient state management
- Optimized bundle size

---

## 📖 Documentation

### Encryption Flow

1. **Initialize Client**: Set up FHEVM instance with provider
2. **Encrypt Input**: Convert plaintext to encrypted format
3. **Submit Transaction**: Send encrypted data to contract
4. **Process On-Chain**: Contract performs FHE operations
5. **Decrypt Result**: Retrieve and decrypt values (if authorized)

### Decryption Methods

**User Decrypt (Private)**
- Requires EIP-712 signature
- Only authorized users can decrypt
- Uses `userDecrypt(ciphertext, contract, signer)`

**Public Decrypt**
- For publicly revealed values
- No signature required
- Uses `publicDecrypt(ciphertext)`

---

## 🌐 Deployment

### Example Deployment Links

- **Next.js Example**: TBD (deploy to Vercel)
- **Digital Court**: [https://digital-court-fhe.vercel.app/](https://digital-court-fhe.vercel.app/)

---

## 🎥 Video Demo

See `demo.mp4` in the root directory for a complete demonstration of:
- SDK installation and setup
- Building a confidential dApp
- Encryption and decryption workflows
- Multi-framework integration

---

## 🏆 Competition Deliverables

✅ **Universal FHEVM SDK** (`packages/fhevm-sdk`)
✅ **Next.js Example** (required, `examples/nextjs-example`)
✅ **React Example** (bonus, `examples/react-example`)
✅ **Vue Example** (bonus, `examples/vue-example`)
✅ **Real-World dApp** (`examples/digital-court-example`)
✅ **Comprehensive Documentation** (this README)
✅ **Video Demo** (`demo.mp4`)
✅ **Quick Setup** (< 10 lines of code)

---

## 🛠️ Technical Stack

- **Core**: TypeScript, ethers.js v6, fhevmjs
- **Build**: Rollup, Hardhat
- **Frameworks**: Next.js 14, React 18, Vue 3
- **Contracts**: Solidity 0.8.24, TFHE library
- **Testing**: Hardhat, Mocha

---

## 📋 Requirements Met

### Core Requirements ✅

- ✅ Framework-agnostic (Node.js, Next.js, Vue, React)
- ✅ All-in-one package wrapper
- ✅ Wagmi-like structure
- ✅ Follows Zama's official SDK patterns
- ✅ EIP-712 signature support
- ✅ User & public decryption flows

### Bonus Features ✅

- ✅ Multiple environment examples (Vue, Node.js, Next.js)
- ✅ Clear documentation with examples
- ✅ Developer-friendly CLI commands
- ✅ Quick setup (< 10 lines)
- ✅ Real-world dApp example

---

## 🚦 Getting Started Checklist

1. **Clone and Install**
   ```bash
   git clone <repository>
   cd fhevm-react-template
   npm install
   ```

2. **Build SDK**
   ```bash
   npm run build:sdk
   ```

3. **Run Example**
   ```bash
   npm run dev:nextjs
   ```

4. **Connect Wallet** - Use MetaMask

5. **Try Encryption** - Click encrypt button

Done! You're building confidential dApps 🎉

---

## 📞 Support & Resources

- **Documentation**: This README and inline code comments
- **Examples**: See `examples/` directory
- **Issues**: GitHub issues for questions
- **Zama Docs**: [https://docs.zama.ai/](https://docs.zama.ai/)

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- Zama for FHEVM technology
- OpenZeppelin for secure contract patterns
- The web3 community for inspiration

---

**Built with ❤️ for the FHEVM Community**

*Making confidential computing accessible to every developer*
