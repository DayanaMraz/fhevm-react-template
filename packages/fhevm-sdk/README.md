# FHEVM SDK

Universal SDK for building confidential dApps with Fully Homomorphic Encryption.

## Installation

```bash
npm install fhevm-sdk
```

## Quick Start

### Core (Framework Agnostic)

```typescript
import { FhevmClient } from 'fhevm-sdk';

const client = new FhevmClient({ provider, network: 'sepolia' });
await client.initialize();

const encrypted = await client.encryptUint32(42);
```

### React

```tsx
import { useFhevm } from 'fhevm-sdk/react';

const { initialize, encryptUint32 } = useFhevm(provider, 'sepolia');
```

### Vue

```vue
<script setup>
import { useFhevm } from 'fhevm-sdk/vue';

const { initialize, encryptUint32 } = useFhevm(provider, 'sepolia');
</script>
```

## Features

- 🔐 Complete FHE encryption/decryption
- 🎣 React hooks & Vue composables
- 📦 All-in-one package
- ⚡ Quick setup (< 10 lines)
- 🛠️ TypeScript support
- 🌐 Framework agnostic

## Documentation

See the main repository README for comprehensive documentation.

## License

MIT
