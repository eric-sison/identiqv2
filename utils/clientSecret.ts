import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

export const generateClientSecret = (encryptionKey: string, length: number): string => {
  // Ensure key is 32 bytes (AES-256). If user passes a shorter key, pad or hash it.
  const key = Buffer.from(encryptionKey).subarray(0, 32).toString().padEnd(32, "0").slice(0, 32);
  const iv = randomBytes(16); // 16-byte IV for AES-GCM
  const secret = randomBytes(length).toString("hex"); // random secret to encrypt
  const cipher = createCipheriv("aes-256-gcm", Buffer.from(key), iv);

  let encrypted = cipher.update(secret, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  // Return encrypted secret + IV + authTag (all needed to decrypt)
  return `${iv.toString("hex")}:${encrypted}:${authTag}`;
};

/**
 * Decrypt an encrypted client secret back to its original value.
 */
export const decryptClientSecret = (encryptionKey: string, encryptedData: string): string => {
  const [ivHex, encrypted, authTagHex] = encryptedData.split(":");

  const key = Buffer.alloc(32);
  Buffer.from(encryptionKey).copy(key);

  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
