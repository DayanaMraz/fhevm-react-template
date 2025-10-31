import { useState, useEffect, useCallback } from 'react';
import { InterfaceAbi, Signer } from 'ethers';
import { ContractClient } from '../core/ContractClient';
import { FhevmClient } from '../core/FhevmClient';

export interface UseContractReturn {
  contract: ContractClient | null;
  isReady: boolean;
  error: Error | null;
  read: <T = any>(functionName: string, ...args: any[]) => Promise<T | null>;
  write: (functionName: string, ...args: any[]) => Promise<any>;
  writeWithEncryption: (
    functionName: string,
    encryptedInputs: Record<string, any>,
    ...additionalArgs: any[]
  ) => Promise<any>;
  decrypt: (ciphertext: bigint) => Promise<bigint | null>;
}

/**
 * React hook for interacting with FHEVM-enabled contracts
 *
 * @example
 * ```tsx
 * const { contract, read, writeWithEncryption } = useContract(
 *   contractAddress,
 *   contractABI,
 *   signer,
 *   fhevmClient
 * );
 *
 * const balance = await read('balanceOf', userAddress);
 * await writeWithEncryption('transfer', { amount: 100 }, recipientAddress);
 * ```
 */
export function useContract(
  address: string | null,
  abi: InterfaceAbi,
  signer: Signer | null,
  fhevmClient: FhevmClient | null
): UseContractReturn {
  const [contract, setContract] = useState<ContractClient | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!address || !signer || !fhevmClient || !fhevmClient.isInitialized()) {
      setContract(null);
      setIsReady(false);
      return;
    }

    try {
      const contractClient = new ContractClient({
        address,
        abi,
        signer,
        fhevmClient,
      });

      setContract(contractClient);
      setIsReady(true);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create contract client');
      setError(error);
      console.error('Contract client creation error:', error);
    }
  }, [address, abi, signer, fhevmClient]);

  const read = useCallback(async <T = any>(
    functionName: string,
    ...args: any[]
  ): Promise<T | null> => {
    if (!contract) {
      setError(new Error('Contract not ready'));
      return null;
    }
    try {
      return await contract.read<T>(functionName, ...args);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Read failed'));
      return null;
    }
  }, [contract]);

  const write = useCallback(async (
    functionName: string,
    ...args: any[]
  ): Promise<any> => {
    if (!contract) {
      setError(new Error('Contract not ready'));
      return null;
    }
    try {
      return await contract.write(functionName, ...args);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Write failed'));
      throw err;
    }
  }, [contract]);

  const writeWithEncryption = useCallback(async (
    functionName: string,
    encryptedInputs: Record<string, any>,
    ...additionalArgs: any[]
  ): Promise<any> => {
    if (!contract) {
      setError(new Error('Contract not ready'));
      return null;
    }
    try {
      return await contract.writeWithEncryption(functionName, encryptedInputs, ...additionalArgs);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Encrypted write failed'));
      throw err;
    }
  }, [contract]);

  const decrypt = useCallback(async (ciphertext: bigint): Promise<bigint | null> => {
    if (!contract) {
      setError(new Error('Contract not ready'));
      return null;
    }
    try {
      return await contract.decryptValue(ciphertext);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Decryption failed'));
      return null;
    }
  }, [contract]);

  return {
    contract,
    isReady,
    error,
    read,
    write,
    writeWithEncryption,
    decrypt,
  };
}
