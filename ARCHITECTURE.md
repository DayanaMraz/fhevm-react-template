# FHEVM SDK Architecture

## Overview

The FHEVM SDK is designed as a multi-layered architecture that provides confidential computing capabilities across different JavaScript frameworks.

## Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│              Application Layer                       │
│  (Next.js, React, Vue, Node.js Applications)        │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│           Framework Adapters Layer                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  React   │  │   Vue    │  │ Others   │          │
│  │  Hooks   │  │Composable│  │          │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│              Core SDK Layer                          │
│  ┌──────────────┐  ┌──────────────┐                │
│  │ FhevmClient  │  │ContractClient│                │
│  │ (Encryption) │  │ (Interaction)│                │
│  └──────────────┘  └──────────────┘                │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│           Blockchain Layer                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ ethers.js│  │ fhevmjs  │  │   TFHE   │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────┘
```

## Core Components

### 1. FhevmClient (Core)

**Purpose**: Manages FHE encryption and decryption operations

**Responsibilities**:
- Initialize FHEVM instance
- Encrypt various data types (uint8, uint16, uint32, uint64, bool)
- Decrypt ciphertexts (user and public methods)
- Manage encryption keys and instances

**Key Methods**:
```typescript
- initialize(): Promise<void>
- encryptUint32(value: number): Promise<Uint8Array>
- userDecrypt(ciphertext, contract, signer): Promise<bigint>
- publicDecrypt(ciphertext): Promise<bigint>
```

### 2. ContractClient (Core)

**Purpose**: Simplifies smart contract interactions with FHE support

**Responsibilities**:
- Wrap ethers.js Contract
- Auto-encrypt inputs for transactions
- Decrypt contract outputs
- Manage events and filters

**Key Methods**:
```typescript
- read(functionName, ...args): Promise<any>
- write(functionName, ...args): Promise<any>
- writeWithEncryption(fn, encrypted, ...args): Promise<any>
- decryptValue(ciphertext): Promise<bigint>
```

### 3. React Hooks (Framework Layer)

**Purpose**: Provide React-friendly API

**Hooks**:
- `useFhevm`: Main FHEVM client hook
- `useContract`: Contract interaction hook

**Features**:
- State management with useState
- Effect handling with useEffect
- Callback optimization with useCallback
- Error handling

### 4. Vue Composables (Framework Layer)

**Purpose**: Provide Vue 3 composition API

**Composables**:
- `useFhevm`: Reactive FHEVM operations
- Similar to React hooks but with Vue refs

## Data Flow

### Encryption Flow

```
User Input → Framework Adapter → FhevmClient → fhevmjs
                                                    ↓
Encrypted Data ← Framework Adapter ← FhevmClient ← Ciphertext
                                                    ↓
                                           Smart Contract
```

### Decryption Flow

```
Smart Contract → Read Ciphertext → FhevmClient → EIP-712 Signature
                                                        ↓
User → Framework Adapter → Plaintext ← FhevmClient ← Decrypt
```

### Transaction Flow

```
User Action → Framework Hook → ContractClient → Encrypt Inputs
                                                      ↓
                                              Create Transaction
                                                      ↓
                                              Submit to Network
                                                      ↓
                                              Wait for Receipt
                                                      ↓
Framework Hook ← Update State ← Transaction Confirmed
```

## Package Structure

```
fhevm-sdk/
├── src/
│   ├── core/                 # Framework-agnostic core
│   │   ├── FhevmClient.ts   # Main encryption client
│   │   ├── ContractClient.ts # Contract wrapper
│   │   └── index.ts         # Core exports
│   │
│   ├── react/               # React-specific
│   │   ├── useFhevm.ts     # FHEVM hook
│   │   ├── useContract.ts  # Contract hook
│   │   └── index.ts        # React exports
│   │
│   ├── vue/                # Vue-specific
│   │   ├── useFhevm.ts    # FHEVM composable
│   │   └── index.ts       # Vue exports
│   │
│   └── index.ts           # Main entry point
│
├── contracts/              # Solidity contracts
│   ├── TFHE.sol
│   ├── FHELib.sol
│   └── ConfidentialERC20.sol
│
└── package.json
```

## Design Patterns

### 1. Adapter Pattern
- Framework-specific adapters wrap core functionality
- Allows same core to work across frameworks

### 2. Singleton Pattern
- FhevmClient instance managed per provider
- Prevents multiple initializations

### 3. Factory Pattern
- ContractClient created from configuration
- Simplifies contract instance creation

### 4. Hook Pattern (React)
- Encapsulates stateful logic
- Reusable across components

### 5. Composable Pattern (Vue)
- Reactive state management
- Similar to hooks but Vue-specific

## Type Safety

All components are written in TypeScript with:
- Full type definitions
- Generic type support
- IntelliSense support
- Runtime type checking where needed

## Error Handling

### Layers of Error Handling:

1. **Core Layer**: Throws detailed errors
2. **Framework Layer**: Catches and stores in state
3. **Application Layer**: Displays to user

### Error Types:
- Initialization errors
- Encryption failures
- Network errors
- Transaction failures
- Permission errors

## State Management

### React:
- useState for local state
- useCallback for memoization
- useEffect for side effects

### Vue:
- ref() for reactive state
- computed() for derived state
- watchEffect() for reactions

## Security Considerations

1. **EIP-712 Signatures**: Used for decryption authorization
2. **Access Control**: Only authorized users can decrypt
3. **No Private Key Exposure**: Uses wallet signatures
4. **Input Validation**: Type checking on encryption
5. **Network Verification**: Ensures correct network

## Performance Optimizations

1. **Lazy Initialization**: FHEVM initialized only when needed
2. **Memoization**: Callbacks and computed values cached
3. **Tree Shaking**: Only used code included in bundle
4. **Code Splitting**: Framework adapters separately bundled
5. **Efficient State Updates**: Minimal re-renders

## Extensibility

### Adding New Encryption Types:

1. Add method to FhevmClient
2. Add hook wrapper
3. Export from package
4. Update types

### Adding New Frameworks:

1. Create adapter directory
2. Implement framework-specific logic
3. Export from package.json
4. Add example

## Testing Strategy

### Unit Tests:
- Core functionality
- Encryption/decryption
- Type conversions

### Integration Tests:
- Contract interactions
- Full workflows
- Multi-framework support

### Example Tests:
- Each example application
- Real-world scenarios

## Deployment

### SDK Package:
- Published to npm
- Semantic versioning
- Changelog maintained

### Examples:
- Deployed to hosting platforms
- Live demos available
- Documentation included

## Future Enhancements

1. **More Frameworks**: Angular, Svelte support
2. **Advanced Types**: Support for arrays, structs
3. **Batch Operations**: Multiple encryptions
4. **Caching Layer**: Reduce redundant operations
5. **Developer Tools**: Browser extensions, debuggers

## Conclusion

The FHEVM SDK provides a clean, modular architecture that:
- Separates concerns effectively
- Supports multiple frameworks
- Maintains type safety
- Handles errors gracefully
- Optimizes performance
- Allows easy extension
