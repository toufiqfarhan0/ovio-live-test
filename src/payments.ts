import { Request, Response } from 'express';

const idempotencyStore = new Map<string, any>();

export interface PaymentPayload {
  amount: number;
  currency: string;
  idempotencyKey: string;
}

export function validatePayment(payload: PaymentPayload): boolean {
  return payload.amount > 0 && !!payload.currency && !!payload.idempotencyKey;
}

export function handlePayment(req: Request, res: Response) {
  const { amount, currency, idempotencyKey } = req.body as PaymentPayload;

  if (!validatePayment({ amount, currency, idempotencyKey })) {
    return res.status(400).json({ error: 'Invalid payment parameters' });
  }

  if (idempotencyStore.has(idempotencyKey)) {
    return res.json({ cached: true, ...idempotencyStore.get(idempotencyKey) });
  }

  const transaction = { id: `tx_${Date.now()}`, status: 'succeeded', amount, currency };
  idempotencyStore.set(idempotencyKey, transaction);

  res.status(201).json(transaction);
}
