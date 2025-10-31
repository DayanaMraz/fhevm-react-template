# 🚀 FHEVM SDK - Quickstart Guide

Get started with confidential dApps in less than 5 minutes!

## Step 1: Install Dependencies

```bash
cd fhevm-react-template
npm install
```

## Step 2: Build the SDK

```bash
npm run build:sdk
```

## Step 3: Run an Example

Choose your framework:

### Next.js (Recommended)
```bash
npm run dev:nextjs
```
Open [http://localhost:3000](http://localhost:3000)

### React
```bash
npm run dev:react
```

### Vue
```bash
npm run dev:vue
```

### Digital Court (Real-world Example)
```bash
npm run dev:digital-court
```

## Step 4: Connect Your Wallet

1. Install MetaMask browser extension
2. Click "Connect Wallet" button
3. Approve connection

## Step 5: Try Encryption

1. Enter a value (e.g., 42)
2. Click "Encrypt"
3. See the encrypted result!

---

## Using the SDK in Your Project

### Install
```bash
npm install fhevm-sdk
```

### React/Next.js
```tsx
import { useFhevm } from 'fhevm-sdk/react';
import { BrowserProvider } from 'ethers';

function App() {
  const provider = new BrowserProvider(window.ethereum);
  const { initialize, encryptUint32 } = useFhevm(provider, 'sepolia');

  useEffect(() => {
    initialize();
  }, []);

  const handleEncrypt = async () => {
    const encrypted = await encryptUint32(42);
    console.log('Encrypted:', encrypted);
  };

  return <button onClick={handleEncrypt}>Encrypt</button>;
}
```

### Vue 3
```vue
<template>
  <button @click="handleEncrypt">Encrypt</button>
</template>

<script setup>
import { onMounted } from 'vue';
import { useFhevm } from 'fhevm-sdk/vue';
import { BrowserProvider } from 'ethers';

const provider = new BrowserProvider(window.ethereum);
const { initialize, encryptUint32 } = useFhevm(provider, 'sepolia');

onMounted(() => initialize());

const handleEncrypt = async () => {
  const encrypted = await encryptUint32(42);
  console.log('Encrypted:', encrypted);
};
</script>
```

### Vanilla JS/Node.js
```javascript
import { FhevmClient } from 'fhevm-sdk';
import { JsonRpcProvider } from 'ethers';

const provider = new JsonRpcProvider('http://localhost:8545');
const client = new FhevmClient({ provider, network: 'localhost' });

await client.initialize();
const encrypted = await client.encryptUint32(42);
```

---

## Next Steps

1. **Explore Examples**: Check out `examples/` directory
2. **Read Docs**: See main `README.md` for full API
3. **Build Your dApp**: Start with the template that fits your needs
4. **Deploy Contracts**: Use Hardhat to deploy FHE contracts

---

## Common Issues

### "Window is not defined" in Next.js
Make sure to check for `window` before accessing:
```tsx
if (typeof window !== 'undefined' && window.ethereum) {
  // Your code
}
```

### FHEVM not initializing
- Ensure provider is connected
- Check network compatibility
- Wait for initialization to complete

### Need Help?
- Check `README.md` for full documentation
- Look at example code in `examples/`
- Open an issue on GitHub

---

**Happy Building! 🔐**
