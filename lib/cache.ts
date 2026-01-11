// Simple localStorage cache with expiration (24h)
export class ProfileCache {
  static get(key: string): any | null {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const { value, expiry } = JSON.parse(raw);
      if (Date.now() > expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return value;
    } catch (e) {
      console.error('Cache get error', e);
      return null;
    }
  }

  static set(key: string, value: any, ttlMs: number = 24 * 60 * 60 * 1000) {
    try {
      const expiry = Date.now() + ttlMs;
      const payload = JSON.stringify({ value, expiry });
      localStorage.setItem(key, payload);
    } catch (e) {
      console.error('Cache set error', e);
    }
  }
}
