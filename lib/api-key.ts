// lib/api-key.ts
import crypto from 'crypto';

/**
 * 生成 API Key
 * 格式: sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 */
export function generateApiKey(): string {
  const randomBytes = crypto.randomBytes(24);
  const key = randomBytes.toString('base64url');
  return `sk_${key}`;
}

/**
 * Hash API Key (用於儲存)
 */
export function hashApiKey(apiKey: string): string {
  return crypto
    .createHash('sha256')
    .update(apiKey)
    .digest('hex');
}

/**
 * 獲取 API Key 前綴 (用於顯示)
 * 例如: sk_abc123... → sk_abc...
 */
export function getApiKeyPrefix(apiKey: string): string {
  if (apiKey.length < 10) return apiKey;
  return `${apiKey.substring(0, 9)}...`;
}

/**
 * 驗證 API Key 格式
 */
export function validateApiKeyFormat(apiKey: string): boolean {
  return /^sk_[A-Za-z0-9_-]{32}$/.test(apiKey);
}
