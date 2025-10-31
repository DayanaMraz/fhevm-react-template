import { BrowserProvider, JsonRpcProvider, Signer } from 'ethers';
import { createInstance, initFhevm, FhevmInstance } from 'fhevmjs';

export interface FhevmConfig {
  provider: BrowserProvider | JsonRpcProvider;
  network: 'localhost' | 'sepolia' | 'mainnet';
  aclAddress?: string;
  kmsVerifierAddress?: string;
}

export interface EncryptedInput {
  handles: Uint8Array[];
  inputProof: string;
}

/**
 * Core FHEVM client for managing encrypted operations
 * This is the main entry point for the SDK
 */
export class FhevmClient {
  private instance: FhevmInstance | null = null;
  private config: FhevmConfig;
  private initialized: boolean = false;

  constructor(config: FhevmConfig) {
    this.config = config;
  }

  /**
   * Initialize the FHEVM instance
   * Must be called before any encryption/decryption operations
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Initialize fhevmjs
      await initFhevm();

      // Get network details
      const network = await this.config.provider.getNetwork();
      const chainId = Number(network.chainId);

      // Create FHEVM instance
      this.instance = await createInstance({
        chainId,
        networkUrl: await this.getNetworkUrl(),
        aclAddress: this.config.aclAddress,
        kmsVerifierAddress: this.config.kmsVerifierAddress,
      });

      this.initialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize FHEVM: ${error}`);
    }
  }

  /**
   * Encrypt a uint8 value
   */
  async encryptUint8(value: number): Promise<Uint8Array> {
    this.ensureInitialized();
    const input = this.instance!.createEncryptedInput(this.config.aclAddress!, this.config.aclAddress!);
    input.add8(value);
    return input.encrypt();
  }

  /**
   * Encrypt a uint16 value
   */
  async encryptUint16(value: number): Promise<Uint8Array> {
    this.ensureInitialized();
    const input = this.instance!.createEncryptedInput(this.config.aclAddress!, this.config.aclAddress!);
    input.add16(value);
    return input.encrypt();
  }

  /**
   * Encrypt a uint32 value
   */
  async encryptUint32(value: number): Promise<Uint8Array> {
    this.ensureInitialized();
    const input = this.instance!.createEncryptedInput(this.config.aclAddress!, this.config.aclAddress!);
    input.add32(value);
    return input.encrypt();
  }

  /**
   * Encrypt a uint64 value
   */
  async encryptUint64(value: bigint): Promise<Uint8Array> {
    this.ensureInitialized();
    const input = this.instance!.createEncryptedInput(this.config.aclAddress!, this.config.aclAddress!);
    input.add64(value);
    return input.encrypt();
  }

  /**
   * Encrypt a boolean value
   */
  async encryptBool(value: boolean): Promise<Uint8Array> {
    this.ensureInitialized();
    const input = this.instance!.createEncryptedInput(this.config.aclAddress!, this.config.aclAddress!);
    input.addBool(value);
    return input.encrypt();
  }

  /**
   * Create encrypted input for multiple values
   */
  createEncryptedInput(contractAddress: string, userAddress: string) {
    this.ensureInitialized();
    return this.instance!.createEncryptedInput(contractAddress, userAddress);
  }

  /**
   * Decrypt a ciphertext using user's private key (EIP-712 signature)
   * @param ciphertext - The encrypted value to decrypt
   * @param contractAddress - Address of the contract that owns the ciphertext
   * @param signer - User's signer for EIP-712 signature
   */
  async userDecrypt(
    ciphertext: bigint,
    contractAddress: string,
    signer: Signer
  ): Promise<bigint> {
    this.ensureInitialized();

    const userAddress = await signer.getAddress();

    // Generate EIP-712 signature for decryption permission
    const eip712 = this.instance!.createEIP712(
      ciphertext,
      contractAddress,
      userAddress
    );

    const signature = await signer.signTypedData(
      eip712.domain,
      eip712.types,
      eip712.message
    );

    // Decrypt using the signature
    return this.instance!.decrypt(ciphertext, signature);
  }

  /**
   * Public decrypt function for publicly revealed ciphertexts
   */
  async publicDecrypt(ciphertext: bigint): Promise<bigint> {
    this.ensureInitialized();
    return this.instance!.decrypt(ciphertext);
  }

  /**
   * Get the FHEVM instance (advanced usage)
   */
  getInstance(): FhevmInstance {
    this.ensureInitialized();
    return this.instance!;
  }

  /**
   * Check if the client is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  private ensureInitialized(): void {
    if (!this.initialized || !this.instance) {
      throw new Error('FhevmClient not initialized. Call initialize() first.');
    }
  }

  private async getNetworkUrl(): Promise<string> {
    const network = await this.config.provider.getNetwork();
    const chainId = Number(network.chainId);

    // Return appropriate network URL based on chainId
    switch (chainId) {
      case 31337: // localhost
        return 'http://127.0.0.1:8545';
      case 11155111: // sepolia
        return 'https://eth-sepolia.g.alchemy.com/v2/demo';
      default:
        throw new Error(`Unsupported network: ${chainId}`);
    }
  }
}
