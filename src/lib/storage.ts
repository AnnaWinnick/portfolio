export interface StorageProvider {
  upload(key: string, buffer: Buffer, mimeType: string): Promise<void>;
  delete(key: string): Promise<void>;
  getUrl(key: string): string;
}

export function generateStorageKey(filename: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const id = crypto.randomUUID().slice(0, 8);
  const ext = filename.split(".").pop()?.toLowerCase() || "bin";
  const safeName = filename
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .slice(0, 40);
  return `${year}/${month}/${id}-${safeName}.${ext}`;
}

// Singleton
let _storage: StorageProvider | null = null;

export function getStorage(): StorageProvider {
  if (!_storage) {
    // Dynamic import avoided — LocalStorage is lightweight
    const { LocalStorage } = require("./storage/local");
    _storage = new LocalStorage();
  }
  return _storage;
}
