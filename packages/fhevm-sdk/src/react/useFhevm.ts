import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider, Signer } from 'ethers';
import { FhevmClient, FhevmConfig } from '../core/FhevmClient';

export interface UseFhevmReturn {
  client: FhevmClient | null;
  isInitialized: boolean;
  isInitializing: boolean;
  error: Error | null;
  initialize: () => Promise<void>;
  encryptUint8: (value: number) => Promise<Uint8Array | null>;
  encryptUint16: (value: number) => Promise<Uint8Array | null>;
  encryptUint32: (value: number) => Promise<Uint8Array | null>;
  encryptUint64: (value: bigint) => Promise<Uint8Array | null>;
  encryptBool: (value: boolean) => Promise<Uint8Array | null>;
  decrypt: (ciphertext: bigint, contractAddress: string, signer: Signer) => Promise<bigint | null>;
}

/**
 * React hook for FHEVM operations
 * Provides easy access to encryption/decryption functionality
 *
 * @example
 * ```tsx
 * const { client, initialize, encryptUint32, decrypt } = useFhevm(provider, 'sepolia');
 *
 * useEffect(() => {
 *   initialize();
 * }, [initialize]);
 *
 * const handleEncrypt = async () => {
 *   const encrypted = await encryptUint32(42);
 * };
 * ```
 */
export function useFhevm(
  provider: BrowserProvider | null,
  network: 'localhost' | 'sepolia' | 'mainnet' = 'localhost',
  config?: Partial<FhevmConfig>
): UseFhevmReturn {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const initialize = useCallback(async () => {
    if (!provider || isInitializing || isInitialized) {
      return;
    }

    setIsInitializing(true);
    setError(null);

    try {
      const fhevmConfig: FhevmConfig = {
        provider,
        network,
        ...config,
      };

      const newClient = new FhevmClient(fhevmConfig);
      await newClient.initialize();

      setClient(newClient);
      setIsInitialized(true);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initialize FHEVM');
      setError(error);
      console.error('FHEVM initialization error:', error);
    } finally {
      setIsInitializing(false);
    }
  }, [provider, network, config, isInitializing, isInitialized]);

  const encryptUint8 = useCallback(async (value: number): Promise<Uint8Array | null> => {
    if (!client) {
      setError(new Error('Client not initialized'));
      return null;
    }
    try {
      return await client.encryptUint8(value);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Encryption failed'));
      return null;
    }
  }, [client]);

  const encryptUint16 = useCallback(async (value: number): Promise<Uint8Array | null> => {
    if (!client) {
      setError(new Error('Client not initialized'));
      return null;
    }
    try {
      return await client.encryptUint16(value);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Encryption failed'));
      return null;
    }
  }, [client]);

  const encryptUint32 = useCallback(async (value: number): Promise<Uint8Array | null> => {
    if (!client) {
      setError(new Error('Client not initialized'));
      return null;
    }
    try {
      return await client.encryptUint32(value);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Encryption failed'));
      return null;
    }
  }, [client]);

  const encryptUint64 = useCallback(async (value: bigint): Promise<Uint8Array | null> => {
    if (!client) {
      setError(new Error('Client not initialized'));
      return null;
    }
    try {
      return await client.encryptUint64(value);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Encryption failed'));
      return null;
    }
  }, [client]);

  const encryptBool = useCallback(async (value: boolean): Promise<Uint8Array | null> => {
    if (!client) {
      setError(new Error('Client not initialized'));
      return null;
    }
    try {
      return await client.encryptBool(value);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Encryption failed'));
      return null;
    }
  }, [client]);

  const decrypt = useCallback(async (
    ciphertext: bigint,
    contractAddress: string,
    signer: Signer
  ): Promise<bigint | null> => {
    if (!client) {
      setError(new Error('Client not initialized'));
      return null;
    }
    try {
      return await client.userDecrypt(ciphertext, contractAddress, signer);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Decryption failed'));
      return null;
    }
  }, [client]);

  return {
    client,
    isInitialized,
    isInitializing,
    error,
    initialize,
    encryptUint8,
    encryptUint16,
    encryptUint32,
    encryptUint64,
    encryptBool,
    decrypt,
  };
}
