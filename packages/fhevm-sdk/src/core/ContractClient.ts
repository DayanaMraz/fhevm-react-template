import { Contract, InterfaceAbi, Signer, BrowserProvider } from 'ethers';
import { FhevmClient } from './FhevmClient';

export interface ContractConfig {
  address: string;
  abi: InterfaceAbi;
  signer: Signer;
  fhevmClient: FhevmClient;
}

/**
 * Enhanced contract client with built-in FHEVM support
 * Wraps ethers Contract with encryption/decryption capabilities
 */
export class ContractClient {
  private contract: Contract;
  private fhevmClient: FhevmClient;
  private signer: Signer;

  constructor(config: ContractConfig) {
    this.contract = new Contract(config.address, config.abi, config.signer);
    this.fhevmClient = config.fhevmClient;
    this.signer = config.signer;
  }

  /**
   * Get the underlying ethers Contract instance
   */
  getContract(): Contract {
    return this.contract;
  }

  /**
   * Call a read-only function
   */
  async read<T = any>(functionName: string, ...args: any[]): Promise<T> {
    return await this.contract[functionName](...args);
  }

  /**
   * Call a state-changing function
   */
  async write(functionName: string, ...args: any[]): Promise<any> {
    const tx = await this.contract[functionName](...args);
    return await tx.wait();
  }

  /**
   * Call a function with encrypted inputs
   * @param functionName - Name of the contract function
   * @param encryptedInputs - Object mapping parameter names to values to encrypt
   * @param additionalArgs - Additional non-encrypted arguments
   */
  async writeWithEncryption(
    functionName: string,
    encryptedInputs: Record<string, any>,
    ...additionalArgs: any[]
  ): Promise<any> {
    const userAddress = await this.signer.getAddress();
    const input = this.fhevmClient.createEncryptedInput(
      this.contract.target as string,
      userAddress
    );

    // Build encrypted input
    const encryptedArgs: any[] = [];
    for (const [key, value] of Object.entries(encryptedInputs)) {
      if (typeof value === 'boolean') {
        input.addBool(value);
      } else if (typeof value === 'number') {
        // Auto-detect appropriate size
        if (value <= 255) input.add8(value);
        else if (value <= 65535) input.add16(value);
        else input.add32(value);
      } else if (typeof value === 'bigint') {
        input.add64(value);
      }
    }

    const encryptedInput = await input.encrypt();

    // Execute transaction with encrypted inputs
    const tx = await this.contract[functionName](
      encryptedInput,
      ...additionalArgs
    );
    return await tx.wait();
  }

  /**
   * Decrypt a value returned from the contract
   */
  async decryptValue(ciphertext: bigint): Promise<bigint> {
    return await this.fhevmClient.userDecrypt(
      ciphertext,
      this.contract.target as string,
      this.signer
    );
  }

  /**
   * Public decrypt (for publicly revealed values)
   */
  async publicDecrypt(ciphertext: bigint): Promise<bigint> {
    return await this.fhevmClient.publicDecrypt(ciphertext);
  }

  /**
   * Get contract address
   */
  getAddress(): string {
    return this.contract.target as string;
  }

  /**
   * Listen to contract events
   */
  on(eventName: string, listener: (...args: any[]) => void): void {
    this.contract.on(eventName, listener);
  }

  /**
   * Remove event listener
   */
  off(eventName: string, listener: (...args: any[]) => void): void {
    this.contract.off(eventName, listener);
  }

  /**
   * Query past events
   */
  async queryFilter(eventName: string, fromBlock?: number, toBlock?: number) {
    return await this.contract.queryFilter(eventName, fromBlock, toBlock);
  }
}
