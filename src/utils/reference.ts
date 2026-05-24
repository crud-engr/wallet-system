import { randomUUID } from 'crypto';

export const ReferencePrefix = {
  FUND: 'FND',
  TRANSFER: 'TRF',
  WITHDRAWAL: 'WDR',
} as const;

type Prefix = (typeof ReferencePrefix)[keyof typeof ReferencePrefix];

// Format: FND-550E8400-E29B-41D4-A716-446655440000
export function generateReference(prefix: Prefix): string {
  return `${prefix}-${randomUUID().toUpperCase()}`;
}
