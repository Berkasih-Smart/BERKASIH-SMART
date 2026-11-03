import { scryptSync, randomBytes, timingSafeEqual, createHmac } from 'crypto';

export function getSecretKey(): string {
  return process.env.JWT_SECRET || 'smart-waste-secret-key-2026';
}

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

export function signToken(payload: object, expiresInMs = 8 * 3600 * 1000): string {
  const fullPayload = {
    ...payload,
    exp: Date.now() + expiresInMs,
    iat: Date.now(),
  };
  const data = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = createHmac('sha256', getSecretKey()).update(data).digest('base64url');
  return `${data}.${signature}`;
}

export function verifyToken(token: string): any {
  if (!token || typeof token !== 'string') return null;

  let cleanToken = token.trim();
  if (cleanToken.startsWith('Bearer ')) {
    cleanToken = cleanToken.slice(7).trim();
  }
  if ((cleanToken.startsWith('"') && cleanToken.endsWith('"')) || (cleanToken.startsWith("'") && cleanToken.endsWith("'"))) {
    cleanToken = cleanToken.slice(1, -1).trim();
  }

  const parts = cleanToken.split('.');
  let dataToVerify = '';
  let payloadBase64 = '';
  let signature = '';

  if (parts.length === 2) {
    // 2-part internal token: payload.signature
    dataToVerify = parts[0];
    payloadBase64 = parts[0];
    signature = parts[1];
  } else if (parts.length === 3) {
    // 3-part standard JWT: header.payload.signature
    dataToVerify = `${parts[0]}.${parts[1]}`;
    payloadBase64 = parts[1];
    signature = parts[2];
  } else {
    return null;
  }

  const secret = getSecretKey();
  const expectedSig = createHmac('sha256', secret).update(dataToVerify).digest('base64url');

  if (signature.length !== expectedSig.length) return null;
  try {
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }
  } catch {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf8'));
    if (payload.exp) {
      // Support exp in seconds (standard RFC 7519 JWT < 10000000000) or milliseconds
      const expMs = payload.exp < 10000000000 ? payload.exp * 1000 : payload.exp;
      if (Date.now() > expMs) {
        return null;
      }
    }
    return payload;
  } catch {
    return null;
  }
}
