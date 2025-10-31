# Contributing to FHEVM SDK

Thank you for your interest in contributing to the FHEVM SDK!

## Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fhevm-react-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the SDK**
   ```bash
   npm run build:sdk
   ```

4. **Run examples**
   ```bash
   npm run dev:nextjs
   ```

## Project Structure

- `packages/fhevm-sdk/` - Core SDK package
  - `src/core/` - Framework-agnostic code
  - `src/react/` - React hooks
  - `src/vue/` - Vue composables
  - `contracts/` - Solidity contracts

- `examples/` - Example applications
  - `nextjs-example/` - Next.js demo
  - `react-example/` - React demo
  - `vue-example/` - Vue demo
  - `digital-court-example/` - Real-world example

## Adding New Features

### Adding a new encryption type

1. Add method to `FhevmClient.ts`
2. Export from `src/core/index.ts`
3. Add hook wrapper in `src/react/useFhevm.ts`
4. Add composable wrapper in `src/vue/useFhevm.ts`
5. Update TypeScript types
6. Add documentation

### Adding framework support

1. Create new directory: `src/<framework>/`
2. Implement adapter functions
3. Export from `package.json` exports
4. Add example in `examples/`
5. Update main README

## Code Style

- Use TypeScript
- Follow existing patterns
- Add JSDoc comments
- Keep functions focused and small

## Testing

```bash
# Run tests
npm test

# Run specific example
npm run dev:nextjs
```

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for API changes
- Include code examples

## Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Update documentation
6. Submit PR with clear description

## Questions?

Open an issue for any questions or suggestions!
