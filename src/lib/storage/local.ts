import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import type { StorageProvider } from "../storage";

export class LocalStorage implements StorageProvider {
  private basePath: string;

  constructor() {
    this.basePath =
      process.env.UPLOAD_DIR ||
      path.join(process.cwd(), "public", "uploads");
  }

  async upload(key: string, buffer: Buffer, _mimeType: string): Promise<void> {
    const filePath = path.join(this.basePath, key);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, buffer);
  }

  async delete(key: string): Promise<void> {
    const filePath = path.join(this.basePath, key);
    await unlink(filePath).catch(() => {});
  }

  getUrl(key: string): string {
    return `/uploads/${key}`;
  }
}
