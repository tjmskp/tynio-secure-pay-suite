// Client-side E2E encryption using Web Crypto (PBKDF2 + AES-GCM)
// The derived key never leaves the browser.

const PBKDF2_ITERATIONS = 250_000;

function bufToB64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < bytes.byteLength; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

function b64ToBuf(b64: string): ArrayBuffer {
  const s = atob(b64);
  const bytes = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
  return bytes.buffer;
}

export function generateSalt(): string {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return bufToB64(salt.buffer);
}

export async function deriveKey(masterPassword: string, saltB64: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(masterPassword),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: b64ToBuf(saltB64),
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptString(plaintext: string, key: CryptoKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(plaintext)
  );
  return { ciphertext: bufToB64(cipher), iv: bufToB64(iv.buffer) };
}

export async function decryptString(ciphertextB64: string, ivB64: string, key: CryptoKey): Promise<string> {
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: b64ToBuf(ivB64) },
    key,
    b64ToBuf(ciphertextB64)
  );
  return new TextDecoder().decode(plain);
}

// Verifies a master password by attempting to decrypt one entry.
// Returns true if decryption succeeds (or there are no entries to test).
export async function verifyKey(
  key: CryptoKey,
  sample?: { ciphertext: string; iv: string }
): Promise<boolean> {
  if (!sample) return true;
  try {
    await decryptString(sample.ciphertext, sample.iv, key);
    return true;
  } catch {
    return false;
  }
}
