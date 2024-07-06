import { bech32 } from 'bech32';
import { createHash } from 'crypto';

const schnorr = require('bip-schnorr');

function deserializePrivateKey(encodedKey: string): string | null {
  try {
    console.log('Decoding Bech32 encoded key...');
    const decoded = bech32.decode(encodedKey);
    console.log('Bech32 decoded:', decoded);

    console.log('Converting Bech32 words to bytes...');
    const privateKeyBytes = bech32.fromWords(decoded.words);
    console.log('Private key bytes:', privateKeyBytes);

    console.log('Converting bytes to hex string...');
    const privateKeyHex = Buffer.from(privateKeyBytes).toString('hex');
    console.log('Private key hex:', privateKeyHex);

    return privateKeyHex;
  } catch (err) {
    console.error('Failed to deserialize private key:', err);
    return null;
  }
}

function serializeSignature(signature: Buffer): string {
  const R = new Uint8Array(signature).slice(0, 32); // x coordinate of the point R
  const s = new Uint8Array(signature).slice(32, 64); // s value
  const serialized = Buffer.concat([Buffer.from(R), Buffer.from(s)]);
  return serialized.toString('hex');
}

function signMessage(message: string, privateKeyHex: string): string | null {
  try {
    console.log('Hashing the message...');
    const messageHash = createHash('sha256').update(message).digest();
    console.log('Message hash:', messageHash);

    console.log('Signing the message hash with private key...');
    const signature = schnorr.sign(privateKeyHex, messageHash);
    console.log('Generated signature:', signature);

    const serializedSignature = serializeSignature(signature);
    console.log('Serialized signature:', serializedSignature);

    return serializedSignature;
  } catch (err) {
    console.error('Signing error:', err);
    return null;
  }
}

export function createSignedMessage(message: string, encodedKey: string) {
  console.log('Starting private key deserialization...');
  const privateKeyHex = deserializePrivateKey(encodedKey);
  if (!privateKeyHex) {
    console.error('Deserialization failed: privateKeyHex is null');
    throw new Error('Failed to deserialize private key');
  }

  console.log('Private key deserialized successfully:', privateKeyHex);

  console.log('Hashing the message for signing...');
  const messageHash = createHash('sha256').update(message).digest('hex');
  console.log('Generated message hash:', messageHash);

  console.log('Signing the message hash...');
  const signature = signMessage(message, privateKeyHex);
  if (!signature) {
    console.error('Signature generation failed: signature is null');
    throw new Error('Failed to sign message');
  }

  console.log('Signed message successfully:', messageHash, signature);

  return { messageHash, signature };
}

// import { bech32 } from 'bech32';
// import { createHash } from 'crypto';

// const schnorr = require('bip-schnorr');

// function deserializePrivateKey(encodedKey: string): Buffer | null {
//     try {
//         const decoded = bech32.decode(encodedKey);
//         const privateKeyBytes = bech32.fromWords(decoded.words);
//         const privateKeyBuffer = Buffer.from(privateKeyBytes);
//         return privateKeyBuffer;
//     } catch (err) {
//         console.error('Failed to deserialize private key:', err);
//         return null;
//     }
// }

// function signMessage(message: string, privateKey: Buffer): string | null {
//     const messageHash = createHash('sha256').update(message).digest();
//     try {
//         const signature = schnorr.sign(privateKey, messageHash);
//         return signature.toString('hex');
//     } catch (err) {
//         console.error('Signing error:', err);
//         return null;
//     }
// }

// export function createSignedMessage(message: string, encodedKey: string) {
//     const privateKeyBuffer = deserializePrivateKey(encodedKey);
//     if (!privateKeyBuffer) {
//         throw new Error('Failed to deserialize private key');
//     }

//     const messageHash = createHash('sha256').update(message).digest('hex');
//     const signature = signMessage(message, privateKeyBuffer);
//     if (!signature) {
//         throw new Error('Failed to sign message');
//     }

//     console.log('Signed message:', messageHash, signature);

//     return { messageHash, signature };
// }
