declare module 'bip-schnorr' {
  import { Buffer } from 'buffer';

  export class Schnorr {
    static sign(privateKey: Buffer, message: Buffer): Buffer;
    static verify(publicKey: Buffer, message: Buffer, signature: Buffer): boolean;
  }

  export const schnorr: Schnorr;
}
