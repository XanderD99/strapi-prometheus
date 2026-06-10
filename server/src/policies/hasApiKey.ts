import type { Core } from '@strapi/strapi';
import { timingSafeEqual } from 'crypto';

type PolicyContext = {
  request: { header: { authorization?: string } };
};

/**
 * Constant-time comparison to avoid leaking the key through timing.
 * Returns early on a length mismatch (only the key length is observable).
 */
const safeCompare = (a: string, b: string): boolean => {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
};

/**
 * Guards the in-app metrics route (used when `server: false`) with a shared
 * API key. Callers must send `Authorization: Bearer <apiKey>`.
 *
 * Fails closed: if no `apiKey` is configured the route rejects every request.
 */
export default (policyContext: PolicyContext, _config: unknown, { strapi }: { strapi: Core.Strapi }): boolean => {
  const apiKey = strapi.plugin('prometheus').config('apiKey') as string | undefined;

  if (!apiKey) {
    strapi.log.warn(
      '[prometheus] Rejected a request to the metrics route because no `apiKey` is configured. ' +
      'Set the plugin `apiKey` config option to allow access when `server: false`.'
    );
    return false;
  }

  const authorization = policyContext.request.header.authorization;
  if (typeof authorization !== 'string' || !authorization.startsWith('Bearer ')) {
    return false;
  }

  const provided = authorization.slice('Bearer '.length).trim();
  return safeCompare(provided, apiKey);
};
