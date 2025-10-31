# Deployment Guide

This guide explains how to deploy the FHEVM SDK examples to production.

## 📦 SDK Package Deployment

### Publishing to npm (Future)

```bash
cd packages/fhevm-sdk
npm run build
npm publish
```

## 🌐 Next.js Example Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd examples/nextjs-example
   vercel
   ```

3. **Environment Variables**
   Set in Vercel dashboard:
   - `NEXT_PUBLIC_SEPOLIA_RPC_URL`
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`

### Alternative: Netlify

```bash
cd examples/nextjs-example
npm run build
# Deploy dist/ folder to Netlify
```

## ⚛️ React Example Deployment

### Build for Production

```bash
cd examples/react-example
npm run build
```

### Deploy to Vercel

```bash
vercel --prod
```

### Deploy to Netlify

```bash
netlify deploy --prod --dir=dist
```

## 🎨 Vue Example Deployment

Same process as React example:

```bash
cd examples/vue-example
npm run build
vercel --prod
# or
netlify deploy --prod --dir=dist
```

## 🏛️ Digital Court Example

### Current Deployment

**Live URL:** https://digital-court-fhe.vercel.app/

**Contract:** 0x6af32dc352959fDf6C19C8Cf4f128dcCe0086b51 (Sepolia)

### Redeploy

```bash
cd examples/digital-court-example
vercel --prod
```

## 🔐 Smart Contract Deployment

### Local Network

```bash
# Terminal 1 - Start local node
npx hardhat node

# Terminal 2 - Deploy
cd packages/fhevm-sdk
npm run deploy:local
```

### Sepolia Testnet

1. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your keys
   ```

2. **Deploy**
   ```bash
   cd packages/fhevm-sdk
   npx hardhat run scripts/deploy.js --network sepolia
   ```

3. **Verify**
   ```bash
   npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
   ```

## 🌍 Environment Configuration

### Production .env

```env
# Network
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=your_deployer_private_key

# APIs
ETHERSCAN_API_KEY=your_etherscan_key
ALCHEMY_API_KEY=your_alchemy_key

# Contracts
CONTRACT_ADDRESS=deployed_contract_address
ACL_ADDRESS=fhe_acl_address
KMS_VERIFIER_ADDRESS=kms_verifier_address
```

## 🔄 CI/CD Setup

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build SDK
        run: npm run build:sdk

      - name: Deploy to Vercel
        run: |
          cd examples/nextjs-example
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 📊 Monitoring

### Recommended Tools

- **Sentry** - Error tracking
- **Vercel Analytics** - Performance monitoring
- **Etherscan** - Contract monitoring

## 🔧 Troubleshooting

### Build Errors

```bash
# Clean and rebuild
npm run clean
npm install
npm run build:sdk
```

### Deployment Issues

1. Check environment variables
2. Verify network connectivity
3. Ensure wallet has funds
4. Check contract addresses

## 📚 Resources

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Hardhat Docs](https://hardhat.org/docs)
- [Etherscan Verification](https://docs.etherscan.io/tutorials/verifying-contracts-programmatically)

## ✅ Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables set
- [ ] Contracts deployed and verified
- [ ] Documentation updated
- [ ] Build succeeds locally
- [ ] No console errors
- [ ] Mobile responsive checked
- [ ] Wallet connection works
- [ ] Encryption/decryption tested

---

**Ready to deploy! 🚀**
