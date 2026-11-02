import { scryptSync, randomBytes, timingSafeEqual, createHmac } from 'crypto';

const SECRET_KEY = process.env.JWT_SECRET || 'smart-waste-secret-key-2026';

export function hashPassword(password: string, salt = randomBytes(16).toString('hex')): { hash: string; salt: string } {
  const hash = scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  if (!password || !hash || !salt) return false;
  try {
    const check = scryptSync(password, salt, 64).toString('hex');
    return timingSafeEqual(Buffer.from(check, 'hex'), Buffer.from(hash, 'hex'));
  } catch {
    return false;
  }
}

export function signToken(payload: object): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', SECRET_KEY).update(data).digest('base64url');
  return `${data}.${signature}`;
}

export function verifyToken(token: string): any {
  if (!token || !token.includes('.')) return null;
  const [data, signature] = token.split('.');
  const expectedSig = createHmac('sha256', SECRET_KEY).update(data).digest('base64url');
  if (signature !== expectedSig) return null;
  try {
    return JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}
