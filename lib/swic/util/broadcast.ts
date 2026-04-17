// summit/sparcc/modules/swic/src/lib/broadcast.ts
import type { ClosedSale } from '@/lib/swic/data/d365-schemas';

const CHANNEL_NAME = 'swic-tablet';

export type BroadcastMessage =
  | { type: 'sale:closed'; data: ClosedSale }
  | { type: 'sale:voided'; data: { transactionId: string } }
  | { type: 'shift:reset' };

let channel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel {
  if (!channel) {
    channel = new BroadcastChannel(CHANNEL_NAME);
  }
  return channel;
}

export function broadcastSale(sale: ClosedSale): void {
  getChannel().postMessage({ type: 'sale:closed', data: sale } satisfies BroadcastMessage);
}

export function broadcastVoid(transactionId: string): void {
  getChannel().postMessage({ type: 'sale:voided', data: { transactionId } } satisfies BroadcastMessage);
}

export function broadcastShiftReset(): void {
  getChannel().postMessage({ type: 'shift:reset' } satisfies BroadcastMessage);
}

export function onBroadcast(callback: (msg: BroadcastMessage) => void): () => void {
  const ch = getChannel();
  const handler = (event: MessageEvent<BroadcastMessage>) => callback(event.data);
  ch.addEventListener('message', handler);
  return () => ch.removeEventListener('message', handler);
}
