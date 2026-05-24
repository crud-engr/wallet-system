export const TransactionType = {
  FUND: 'FUND',
  TRANSFER: 'TRANSFER',
  WITHDRAWAL: 'WITHDRAWAL',
} as const;

export const TransactionStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const;

// These are hardcoded here for the purpose of this project, but best practise is config/env
export const MIN_FUND_AMOUNT = 50;
export const MIN_WITHDRAWAL_AMOUNT = 50;
