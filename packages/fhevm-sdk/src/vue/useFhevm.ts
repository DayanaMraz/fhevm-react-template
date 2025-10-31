import { ref, Ref, computed } from 'vue';
import { BrowserProvider, Signer } from 'ethers';
import { FhevmClient, FhevmConfig } from '../core/FhevmClient';

export interface UseFhevmReturn {
  client: Ref<FhevmClient | null>;
  isInitialized: Ref<boolean>;
  isInitializing: Ref<boolean>;
  error: Ref<Error | null>;
  initialize: () => Promise<void>;
  encryptUint8: (value: number) => Promise<Uint8Array | null>;
  encryptUint16: (value: number) => Promise<Uint8Array | null>;
  encryptUint32: (value: number) => Promise<Uint8Array | null>;
  encryptUint64: (value: bigint) => Promise<Uint8Array | null>;
  encryptBool: (value: boolean) => Promise<Uint8Array | null>;
  decrypt: (ciphertext: bigint, contractAddress: string, signer: Signer) => Promise<bigint | null>;
}

/**
 * Vue composable for FHEVM operations
 * Provides reactive access to encryption/decryption functionality
 *
 * @example
 * ```vue
 * <script setup>
 * import { useFhevm } from 'fhevm-sdk/vue';
 *
 * const { client, initialize, encryptUint32 } = useFhevm(provider, 'sepolia');
 *
 * onMounted(async () => {
 *   await initialize();
 * });
 *
 * const handleEncrypt = async () => {
 *   const encrypted = await encryptUint32(42);
 * };
 * </script>
 * ```
 */
export function useFhevm(
  provider: BrowserProvider | null,
  network: 'localhost' | 'sepolia' | 'mainnet' = 'localhost',
  config?: Partial<FhevmConfig>
): UseFhevmReturn {
  const client = ref<FhevmClient | null>(null);
  const isInitialized = ref(false);
  const isInitializing = ref(false);
  const error = ref<Error | null>(null);

  const initialize = async () => {
    if (!provider || isInitializing.value || isInitialized.value) {
      return;
    }

    isInitializing.value = true;
    error.value = null;

    try {
      const fhevmConfig: FhevmConfig = {
        provider,
        network,
        ...config,
      };

      const newClient = new FhevmClient(fhevmConfig);
      await newClient.initialize();

      client.value = newClient;
      isInitialized.value = true;
    } catch (err) {
      const e = err instanceof Error ? err : new Error('Failed to initialize FHEVM');
      error.value = e;
      console.error('FHEVM initialization error:', e);
    } finally {
      isInitializing.value = false;
    }
  };

  const encryptUint8 = async (value: number): Promise<Uint8Array | null> => {
    if (!client.value) {
      error.value = new Error('Client not initialized');
      return null;
    }
    try {
      return await client.value.encryptUint8(value);
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Encryption failed');
      return null;
    }
  };

  const encryptUint16 = async (value: number): Promise<Uint8Array | null> => {
    if (!client.value) {
      error.value = new Error('Client not initialized');
      return null;
    }
    try {
      return await client.value.encryptUint16(value);
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Encryption failed');
      return null;
    }
  };

  const encryptUint32 = async (value: number): Promise<Uint8Array | null> => {
    if (!client.value) {
      error.value = new Error('Client not initialized');
      return null;
    }
    try {
      return await client.value.encryptUint32(value);
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Encryption failed');
      return null;
    }
  };

  const encryptUint64 = async (value: bigint): Promise<Uint8Array | null> => {
    if (!client.value) {
      error.value = new Error('Client not initialized');
      return null;
    }
    try {
      return await client.value.encryptUint64(value);
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Encryption failed');
      return null;
    }
  };

  const encryptBool = async (value: boolean): Promise<Uint8Array | null> => {
    if (!client.value) {
      error.value = new Error('Client not initialized');
      return null;
    }
    try {
      return await client.value.encryptBool(value);
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Encryption failed');
      return null;
    }
  };

  const decrypt = async (
    ciphertext: bigint,
    contractAddress: string,
    signer: Signer
  ): Promise<bigint | null> => {
    if (!client.value) {
      error.value = new Error('Client not initialized');
      return null;
    }
    try {
      return await client.value.userDecrypt(ciphertext, contractAddress, signer);
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Decryption failed');
      return null;
    }
  };

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
