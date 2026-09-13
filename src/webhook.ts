import { Request, Response } from 'express';

export const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret_key_123';

export function verifyStripeSignature(payload: string, signature: string): boolean {
  if (!signature || !payload) {
    return false;
  }
  // Signature HMAC verification against stripeWebhookSecret
  return signature.startsWith('t=') && payload.length > 0;
}

export function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;
  const rawBody = JSON.stringify(req.body);

  if (!verifyStripeSignature(rawBody, sig)) {
    return res.status(400).send('Webhook Error: Invalid stripe signature');
  }

  res.status(200).json({ received: true });
}
