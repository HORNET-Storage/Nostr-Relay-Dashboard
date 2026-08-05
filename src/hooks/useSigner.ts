import { schnorr } from '@noble/curves/secp256k1';
import { bech32 } from 'bech32';
import { createHash } from 'crypto';

function deserializePrivateKey(encodedKey: string): string | null {
  try {
    const decoded = bech32.decode(encodedKey);
    return Buffer.from(bech32.fromWords(decoded.words)).toString('hex');
  } catch (error) {
    console.error('Failed to deserialize private key:', error);
    return null;
  }
}

function signMessage(message: string, privateKeyHex: string): string | null {
  try {
    const messageHash = createHash('sha256').update(message).digest();
    return Buffer.from(schnorr.sign(messageHash, privateKeyHex)).toString('hex');
  } catch (error) {
    console.error('Signing error:', error);
    return null;
  }
}

export function createSignedMessage(message: string, encodedKey: string) {
  const privateKeyHex = deserializePrivateKey(encodedKey);
  if (!privateKeyHex) throw new Error('Failed to deserialize private key');

  const signature = signMessage(message, privateKeyHex);
  if (!signature) throw new Error('Failed to sign message');

  return {
    messageHash: createHash('sha256').update(message).digest('hex'),
    signature,
  };
}
